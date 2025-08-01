import React from 'react';
import Typography from '.';

const { Title, Text, Link } = Typography;

export default { title: 'General/Typography', component: Typography };

export const Article = () => (
  <Typography tag="article">
    <h1>Article Title</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec dui vitae nisl ultricies aliquam. Donec eu
      efficitur purus. Suspendisse potenti. Praesent dapibus, libero id laoreet posuere, erat enim efficitur massa, quis
      varius sapien turpis et elit.
    </p>
    <h2>Sub-heading</h2>
    <p>
      Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris quis est eu
      eros tempor facilisis. Sed et ex vitae quam eleifend maximus. Integer in purus id justo volutpat iaculis. Donec
      quis justo in sem scelerisque tincidunt.
    </p>
  </Typography>
);

export const Titles = () => (
  <div className="space-y-2">
    <Title level={1}>Title 1</Title>
    <Title level={2}>Title 2</Title>
    <Title level={3}>Title 3</Title>
    <Title level={4}>Title 4</Title>
    <Title level={5}>Title 5</Title>
  </div>
);

export const Texts = () => (
  <div className="space-y-2">
    <Text>Default text</Text>
    <Text variant="muted">Muted text</Text>
    <Text variant="success">Success text</Text>
    <Text variant="warning">Warning text</Text>
    <Text variant="error">Danger text</Text>
    <Text disabled>Disabled text</Text>
    <Text blockquote>Blockquote text</Text>
    <Text code>Code snippet</Text>
    <Text keyboard>Keyboard input</Text>
    <Text mark>Marked text</Text>
    <Text underline>Underlined text</Text>
    <Text strikethrough>Strikethrough text</Text>
    <Text strong>Strong text</Text>
    <Text sm>Small text</Text>
    <Text xs>Extra-small text</Text>
  </div>
);

export const Links = () => (
  <div className="space-y-2">
    <Link href="#">Link</Link>
    <Link href="#" disabled>
      Disabled Link
    </Link>
  </div>
);
