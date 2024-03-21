import React from 'react';
import Typography from '../Typography';
import CardStyles from './Card.module.css';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  cover?: React.ReactNode;
  description?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
  title?: string;
  titleExtra?: React.ReactNode;
}

function Card({ children, className, cover, hoverable, style, title, titleExtra }: CardProps) {
  const classes = [CardStyles['sbui-card']];
  if (hoverable) classes.push(CardStyles['sbui-card--hoverable']);
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} style={style}>
      {title && (
        <div className={CardStyles['sbui-card-head']}>
          <Typography.Text style={{ margin: 0 }}>{title}</Typography.Text>
          <Typography.Link style={{ margin: 0 }}>{titleExtra}</Typography.Link>
        </div>
      )}
      {cover}
      <div className={CardStyles['sbui-card-content']}>{children}</div>
    </div>
  );
}

interface MetaProps {
  title?: string;
  description?: string;
  style?: React.CSSProperties;
  className?: string;
}

function Meta({ title, description, style, className }: MetaProps) {
  return (
    <div style={style} className={className}>
      <Typography.Title style={{ margin: '0' }} level={5}>
        {title}
      </Typography.Title>
      <div>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </div>
    </div>
  );
}

Card.Meta = Meta;
export default Card;
