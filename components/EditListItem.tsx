import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonIcon,
  Card,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { CheckIcon, XIcon } from "lucide-react-native";
import { ListItem, deleteItem, editItem } from '@/store/slice';
import { useAppDispatch } from '@/store/hooks';

export default function EditListItem({ listItem, onClose }: { listItem: ListItem, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(listItem.label);
  const handleCancel = () => {
    onClose();
  }
  const handleSave = () => {
    dispatch(editItem({ ...listItem, label: inputValue }));
    onClose();
  }
  return (
    <Card size="md" m="$1" variant="elevated">
      <HStack justifyContent="space-between" alignItems="center">
        <Input variant="outline" size="md">
          <InputField value={inputValue} onChangeText={(text) => setInputValue(text)} onSubmitEditing={handleSave} />
        </Input>
        <HStack>
          <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleCancel}>
            <ButtonIcon as={XIcon} />
          </Button>
          <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleSave}>
            <ButtonIcon as={CheckIcon} />
          </Button>
        </HStack>
      </HStack>
    </Card>
  );
}

const styles = StyleSheet.create({
});
