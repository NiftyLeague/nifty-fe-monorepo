import InputIconContainerStyles from './InputIconContainer.module.css';

export default function InputIconContainer({ icon }: { icon: React.ReactNode }) {
  return <div className={InputIconContainerStyles['sbui-input-icon-container']}>{icon}</div>;
}
