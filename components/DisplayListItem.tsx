import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonIcon,
  Card,
  ChevronRightIcon,
  HStack,
  Icon,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { TrashIcon, EditIcon } from "lucide-react-native";
import { ListItem, deleteItem } from '@/store/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import EditListItem from './EditListItem';

export default function DisplayListItem({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const listItems = useAppSelector((state) => state.app.listItems);
  const responseItems = useAppSelector((state) => state.app.responseItems);
  const [listItem, setListItem] = useState<ListItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const match = listItems.find((item) => item.id === id);
    if (match) setListItem(match);
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
      <VStack>
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
        <HStack alignItems="center">
          {listItem?.responses && listItem.responses.length > 0 && (<Icon as={ChevronRightIcon} mr="$2" />)}
          <Text>
            {listItem?.responses.map((item, index) => {
              const match = responseItems.find((findMatch) => findMatch.id === item);
              let retVal = '';
              if (match) {  
                if (index > 0) retVal += ', ';
                retVal += match.label;
              }
              return retVal;
            })}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}
