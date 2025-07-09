import React, { useState, PropsWithChildren } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { Space } from '../Space';
import { TabsContext } from './TabsContext';
import TabsStyles from './Tabs.module.css';

export interface TabsProps {
  id?: string;
  type?: 'pills' | 'underlined' | 'cards';
  defaultActiveId?: string;
  activeId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  block?: boolean;
  tabBarGutter?: number;
  tabBarStyle?: React.CSSProperties;
  onChange?: (id: string) => void;
  onClick?: (id: string) => void;
  scrollable?: boolean;
  addOnBefore?: React.ReactNode;
  addOnAfter?: React.ReactNode;
}

function Tabs({
  id,
  children,
  defaultActiveId,
  activeId,
  type,
  size,
  block,
  tabBarGutter,
  tabBarStyle,
  onChange,
  onClick,
  scrollable,
  addOnBefore,
  addOnAfter,
}: PropsWithChildren<TabsProps>) {
  const [activeTab, setActiveTab] = useState(
    defaultActiveId
      ? defaultActiveId
      : // if no defaultActiveId is set use the first panel
        Array.isArray(children) && children[0].props
        ? children[0].props.id
        : '',
  );

  // activeId state can be overriden externally with `active`
  // defaults to use activeTab
  const active = activeId ? activeId : activeTab;

  function onTabClick(id: string) {
    const newTabSelected = id !== active;
    setActiveTab(id);
    if (onClick) onClick(id);
    if (onChange && newTabSelected) onChange(id);
  }

  // for styling the tabs for underline style
  const underlined = type === 'underlined';

  // if only 1 react child, it needs to be converted to a list/array
  // this is so 1 tab can be displayed
  if (children && !Array.isArray(children)) {
    children = [children];
  }

  return (
    <Space direction="vertical" size={4}>
      <div id={id} role="tablist" aria-label={id} style={tabBarStyle}>
        <Space className={TabsStyles['sbui-tab-bar-container']} size={0}>
          <Space
            size={tabBarGutter ? tabBarGutter : underlined ? 6 : 3}
            className={
              TabsStyles['sbui-tab-bar-inner-container'] +
              (scrollable ? ` ${TabsStyles['sbui-tab-bar--scrollable']}` : '')
            }
          >
            {addOnBefore}
            {Array.isArray(children) &&
              children.map((tab: React.ReactElement<PanelProps>) => {
                if (!tab) return null;
                const activeMatch = active === tab.props.id;
                return (
                  <Button
                    icon={tab.props.icon}
                    size={size}
                    block={block}
                    shadow={!block}
                    className={
                      underlined && activeMatch
                        ? `${TabsStyles['sbui-tab-button-underline']} ${TabsStyles['sbui-tab-button-underline--active']}`
                        : underlined
                          ? TabsStyles['sbui-tab-button-underline']
                          : ''
                    }
                    type={activeMatch && !underlined ? 'primary' : 'text'}
                    key={`${tab.props.id}-tab-button`}
                    onClick={() => onTabClick(`${tab.props.id}`)}
                    ariaSelected={activeMatch ? true : false}
                    ariaControls={tab.props.id}
                    tabIndex={activeMatch ? 0 : -1}
                    role="tab"
                  >
                    {tab.props.label}
                  </Button>
                );
              })}
          </Space>
          {addOnAfter}
        </Space>
        {underlined && <Divider />}
      </div>
      <TabsContext.Provider value={{ activeId: active }}>{children}</TabsContext.Provider>
    </Space>
  );
}

interface PanelProps {
  id?: string;
  label?: string;
  icon?: React.ReactNode;
}

export function Panel({ children, id }: PropsWithChildren<PanelProps>) {
  return (
    children && (
      <TabsContext.Consumer>
        {({ activeId }) => {
          const active = activeId === id;
          return (
            <div id={id} role="tabpanel" tabIndex={active ? 0 : -1} aria-labelledby={id} hidden={!active}>
              {children}
            </div>
          );
        }}
      </TabsContext.Consumer>
    )
  );
}

Tabs.Panel = Panel;
export default Tabs;
