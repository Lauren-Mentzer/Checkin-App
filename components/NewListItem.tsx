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
  Pressable,
  Text,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { TrashIcon, EditIcon } from "lucide-react-native";
import { ListItem, deleteItem } from '@/store/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import EditListItem from './EditListItem';

export default function NewListItem({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const listItems = useAppSelector((state) => state.app.listItems);
  const [listItem, setListItem] = useState<ListItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const match = listItems.find((item) => item.id === id);
    if (match) setListItem(match);
    console.log(match);
  }, [listItems]);

  const handleDelete = () => {
    dispatch(deleteItem(id));
  }
  const handleEdit = () => {
    setIsEditMode(true);
  }
  if (isEditMode && listItem) {
    return (
      <EditListItem listItem={listItem} onClose={() => setIsEditMode(false)} />
    )
  } else return (
    <Card size="md" m="$1" variant="elevated">
      <HStack justifyContent="space-between" alignItems="center">
        <Text>{ listItem?.label }</Text>
        <HStack>
          <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleEdit}>
            <ButtonIcon as={EditIcon} />
          </Button>
          <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleDelete}>
            <ButtonIcon as={TrashIcon} />
          </Button>
        </HStack>
      </HStack>
    </Card>
  );
}

const styles = StyleSheet.create({
});
