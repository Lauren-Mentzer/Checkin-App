import React, { useState } from 'react';
import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  Card,
  ChevronDownIcon,
  HStack,
  Icon,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
} from "@gluestack-ui/themed";
import { CheckIcon, XIcon } from "lucide-react-native";
import { ListItem, addResponseItem, deleteResponseItem, editItem } from '@/store/slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Chip from './Chip';

export default function EditListItem({ listItem, onClose }: { listItem: ListItem, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const responseItems = useAppSelector((state) => state.app.responseItems);
  const listItems = useAppSelector((state) => state.app.listItems);
  const [inputValue, setInputValue] = useState(listItem.label);
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [showNewInput, setShowNewInput] = useState(false);
  const [responseValue, setResponseValue] = useState('');
  const [displayResponseValues, setDisplayResponseValues] = useState(listItem.responses);

  const handleCancel = () => {
    onClose();
  }
  const handleSave = () => {
    const oldItems = listItem.responses;
    const newItems = displayResponseValues.map((item) => {
      const match = responseItems.find((matchItem) => matchItem.label === item);
      return match ? match.id : item;
    });
    oldItems.forEach((item) => {
      const match = newItems.find((matchItem) => matchItem === item);
      if (!match) {
        let isPresent = false;
        listItems.forEach((checkListItem) => {
          const checkMatch = checkListItem.responses.find((check) => check === item);
          if (checkMatch && checkListItem.id !== listItem.id) isPresent = true;
        });
        if (!isPresent) {
          dispatch(deleteResponseItem(item));
        }
      }
    });
    dispatch(editItem({ ...listItem, label: inputValue, responses: newItems }));
    onClose();
  }
  const handleCancelResponse = () => {
    setResponseValue('');
    setShowNewInput(false);
    setIsAddingResponse(false);
  }
  const handleAddResponse = () => {
    setDisplayResponseValues((oldList) => [...oldList, responseValue]);
    const match = responseItems.find((item) => item.label === responseValue);
    if (!match) {
      dispatch(addResponseItem(responseValue));
    }
    setShowNewInput(false);
    setResponseValue('');
    setIsAddingResponse(false);
  }
  const handleDeleteResponse = (response: string) => {
    setDisplayResponseValues((list) => list.filter((item) => item !== response));
  }
  const handleSelectionChange = (selection: string) => {
    if (selection === 'ENTER NEW VALUE') {
      setShowNewInput(true);
    } else {
      const match = responseItems.find((item) => item.id === selection);
      if (match) {
        console.log(displayResponseValues, match.id);
        setDisplayResponseValues((oldList) => [...oldList, match.id]);
      }
      setIsAddingResponse(false);
    }
  }
  return (
    <Card size="md" m="$1" variant="elevated">
      <Text my="$2"><label htmlFor="name">Signal name:</label></Text>
      <Input variant="outline" size="md" id="name">
        <InputField value={inputValue} onChangeText={(text) => setInputValue(text)} onSubmitEditing={handleSave} />
      </Input>
      <Text my="$2"><label>Responses:</label></Text>
      <HStack flexWrap="wrap" columnGap="$1" rowGap="$1">
        {displayResponseValues.map((response) => {
          const match = responseItems.find((item) => item.id === response);
          return (<Chip key={response} value={match ? match.label : response} handleClick={() => handleDeleteResponse(response)} />)
        })}
        {!isAddingResponse && (
          <Button borderRadius="$full" size="lg" p="$3" onPress={() => setIsAddingResponse(true)}>
            <ButtonIcon as={AddIcon} />
          </Button>
        )}
        {isAddingResponse && !showNewInput && (
          <Select onValueChange={handleSelectionChange}>
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Select option" />
              {/* @ts-ignore */}
              <SelectIcon mr="$3">
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="ENTER NEW VALUE" value="ENTER NEW VALUE" key="ENTER NEW VALUE" />
                {responseItems.filter((item) => {
                  const match = displayResponseValues.find((matchItem) => matchItem === item.label);
                  return !match;
                }).map((item) => (
                  <SelectItem label={item.label} value={item.id} key={item.id} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        )}
        {isAddingResponse && showNewInput && (
          <HStack justifyContent="space-between" alignItems="center" w="$full">
            <Input variant="outline" size="md" id="name">
              <InputField placeholder="Enter new response" value={responseValue} onChangeText={(text) => setResponseValue(text)} onSubmitEditing={handleAddResponse} />
            </Input>
            <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleCancelResponse}>
              <ButtonIcon as={XIcon} />
            </Button>
            <Button borderRadius="$full" size="lg" p="$3" m="$1" onPress={handleAddResponse}>
              <ButtonIcon as={CheckIcon} />
            </Button>
          </HStack>
        )}
      </HStack>
      <HStack justifyContent="space-around" mt="$4">
        <Button size="md" variant="solid" action="secondary" onPress={handleCancel}>
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button size="md" variant="solid" action="primary" onPress={handleSave}>
          <ButtonText>Save</ButtonText>
        </Button>
      </HStack>
    </Card>
  );
}
