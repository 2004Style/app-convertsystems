import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import { Platform } from 'react-native';
import { Text } from 'react-native';

function Avatar({
  className,
  alt,
  children,
  ...props
}: AvatarPrimitive.RootProps & React.RefAttributes<AvatarPrimitive.RootRef> & { alt?: string; children?: React.ReactNode }) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      alt={alt || 'Avatar'}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.ImageProps & React.RefAttributes<AvatarPrimitive.ImageRef>) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({
  className,
  style,
  children,
  ...props
}: AvatarPrimitive.FallbackProps & React.RefAttributes<AvatarPrimitive.FallbackRef> & { children?: React.ReactNode }) {
  // En React Native, el texto debe estar envuelto en un componente Text
  const content = Platform.OS !== 'web' ? <Text>{children}</Text> : children;

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'bg-muted flex size-full flex-row items-center justify-center rounded-full',
        className
      )}
      style={style}
      {...props}
    >
      {content}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
