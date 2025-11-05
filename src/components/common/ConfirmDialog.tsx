/**
 * ConfirmDialog Component
 * Modal dialog for confirming destructive actions
 */

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Button, Card } from 'heroui-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center p-6"
        onPress={onCancel}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-sm p-6">
            <Text className="text-xl font-semibold text-foreground mb-2">
              {title}
            </Text>
            <Text className="text-base text-muted-foreground mb-6">
              {message}
            </Text>
            <View className="flex-row gap-3">
              <Button
                variant="secondary"
                onPress={onCancel}
                className="flex-1"
              >
                {cancelText}
              </Button>
              <Button
                variant={destructive ? 'destructive' : 'primary'}
                onPress={onConfirm}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
