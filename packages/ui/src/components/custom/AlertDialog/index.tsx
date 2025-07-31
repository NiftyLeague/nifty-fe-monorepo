import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@nl/ui/base/button';
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@nl/ui/base/alert-dialog';

export interface AlertDialogProps {
  cancelText?: string;
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
  confirmText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  description?: string;
  onCancel?: () => void;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  triggerElement?: React.ReactNode;
}

export function AlertDialog({
  cancelText = 'Cancel',
  cancelVariant = 'outline',
  confirmText = 'Continue',
  confirmVariant = 'default',
  description,
  onCancel,
  onConfirm,
  title,
  triggerElement,
}: AlertDialogProps) {
  return (
    <AlertDialogPrimitive>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={cancelVariant} onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}

export default AlertDialog;
