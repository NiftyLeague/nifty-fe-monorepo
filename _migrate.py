import re, pathlib, subprocess

ROOT = pathlib.Path('/Users/amf/Developer/NiftyLeague/nifty-fe-monorepo')

# Map of test files (relative to repo root) for which fake-timer / jest import is needed.
# We'll detect per-file whether timers or stubGlobal/unstub are used and patch imports accordingly.

import_terms = ['describe','it','test','expect','beforeEach','afterEach','beforeAll','afterAll']

def transform(text, fname):
    orig = text
    needs_mock = 'vi.fn' in text or 'vi.mock' in text or 'vi.spyOn' in text or 'vi.hoisted' in text or 'vi.stubGlobal' in text or 'vi.mocked' in text or 'vi.clearAllMocks' in text or 'vi.restoreAllMocks' in text or 'vi.unstubAllGlobals' in text
    needs_jest = 'vi.useFakeTimers' in text or 'vi.useRealTimers' in text or 'vi.advanceTimersByTime' in text or 'vi.runOnlyPendingTimers' in text or 'vi.setSystemTime' in text

    # 1) import line
    # capture existing vitest import names
    m = re.search(r"import\s*\{([^}]*)\}\s*from\s*['\"]vitest['\"]", text)
    if m:
        names = [n.strip() for n in m.group(1).split(',') if n.strip()]
        # remove vitest-only or replace
        mapped = {
            'vi': None,  # dropped; replaced with mock/jest/spyOn
        }
        keep = []
        need_mock = False
        need_jest = False
        need_spy = False
        for n in names:
            if n in ('describe','it','test','expect','beforeEach','afterEach','beforeAll','afterAll'):
                keep.append(n)
            elif n == 'vi':
                need_mock = True
            elif n in ('mock','spyOn','jest'):
                # already (shouldn't happen)
                if n == 'mock': need_mock = True
                elif n == 'jest': need_jest = True
                elif n == 'spyOn': need_spy = True
        # Build new imports
        out = ''
        if keep:
            out += "import { " + ", ".join(keep) + " } from 'bun:test';\n"
        if need_mock or need_spy:
            extra = []
            if need_mock: extra.append('mock')
            if need_spy: extra.append('spyOn')
            out += "import { " + ", ".join(extra) + " } from 'bun:test';\n"
        if need_jest:
            out += "import { jest } from 'bun:test';\n"
        text = text[:m.start()] + out.strip() + "\n" + text[m.end():]
    else:
        # maybe only `import 'vitest'`-style or no vi. handle file-level env comment separately.
        pass

    # 2) vi.hoisted: const X = vi.hoisted(() => ( {...} )) -> const X = {...} with vi.fn -> mock()
    # Replace vi.hoisted( ( => (  and trailing ) )
    def hoisted_repl(mm):
        inner = mm.group(1)
        # inner looks like: () => ({ a: vi.fn(), b: vi.fn(()=>x) })
        # remove the leading "() => "
        inner = re.sub(r"^\s*\(\)\s*=>\s*", "", inner)
        return inner
    # first pass: convert vi.hoisted(...) wrapping
    text = re.sub(r"vi\.hoisted\(\s*(\(\)\s*=>.*?)\)\s*;", lambda mm: hoisted_repl(mm) + ";", text, flags=re.S)

    # 3) vi.fn / vi.spyOn / vi.mock / etc
    text = text.replace('vi.fn(', 'mock(')
    text = text.replace('vi.spyOn(', 'spyOn(')
    text = text.replace('vi.mock(', 'mock.module(')
    text = text.replace('vi.doMock(', 'mock.module(')
    text = text.replace('vi.mocked(', 'mocked(')  # we'll define mocked via mock() or leave; handle later
    text = text.replace('vi.clearAllMocks()', 'mock.clear()')
    text = text.replace('vi.restoreAllMocks()', 'mock.restore()')
    text = text.replace('vi.unstubAllGlobals()', 'mock.unstubAllGlobals()')  # placeholder, fix below
    text = text.replace('vi.stubEnv(', 'mock.stubEnv(')  # placeholder
    text = text.replace('vi.stubGlobal(', 'stubGlobal(')  # placeholder; define helper
    text = text.replace('vi.useFakeTimers()', 'jest.useFakeTimers()')
    text = text.replace('vi.useRealTimers()', 'jest.useRealTimers()')
    text = text.replace('vi.advanceTimersByTime(', 'jest.advanceTimersByTime(')
    text = text.replace('vi.setSystemTime(', 'jest.setSystemTime(')
    text = text.replace('vi.runOnlyPendingTimers()', 'jest.runOnlyPendingTimers()')

    # 4) jest-dom /vitest -> /jest-dom
    text = text.replace("@testing-library/jest-dom/vitest", "@testing-library/jest-dom")
    # 5) file-level env comment
    text = text.replace("// @vitest-environment jsdom\n", "")

    # 6) mock.module env / stubGlobal helpers: define at top if used and not present
    if 'mock.stubEnv(' in text or 'stubGlobal(' in text or 'mock.unstubAllGlobals()' in text:
        helper = ""
        if 'stubGlobal(' in text and 'function stubGlobal' not in text:
            helper += ("const stubGlobal = (name, value) => { Object.defineProperty(globalThis, name, { value, configurable: true, writable: true }); };\n")
            text = helper + text
        if 'mock.stubEnv(' in text:
            text = text.replace('mock.stubEnv(', 'stubEnv(')
            if 'function stubEnv' not in text:
                text = ("const stubEnv = (k, v) => { process.env[k] = v; };\n") + text
        if 'mock.unstubAllGlobals()' in text:
            # best-effort: clear known stubbed globals by reset; with isolate=true per-file this is mostly safe.
            text = text.replace('mock.unstubAllGlobals()', 'undefined')
    return text

files = list(ROOT.glob('**/*.test.ts')) + list(ROOT.glob('**/*.test.tsx'))
for p in files:
    if 'node_modules' in str(p): continue
    t = p.read_text()
    if "'vitest'" not in t and '"vitest"' not in t and 'vi.' not in t:
        # still maybe needs env comment removal
        if '@vitest-environment' in t:
            nt = t.replace("// @vitest-environment jsdom\n","")
            if nt != t: p.write_text(nt)
        continue
    nt = transform(t, str(p))
    p.write_text(nt)
    print("updated", p.relative_to(ROOT))
print("DONE")
