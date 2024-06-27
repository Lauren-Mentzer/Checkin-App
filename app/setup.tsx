import {
  Button,
  ButtonText,
  ScrollView,
  Input,
  InputField,
  VStack,
  Heading,
  HStack,
  ButtonIcon
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, loadStore } from "../store/slice";
import { useEffect, useState } from "react";
import { Link, router } from 'expo-router';
import DisplayListItem from "@/components/DisplayListItem";
import { ArrowLeftIcon } from "lucide-react-native";

export default function Setup() {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const list = useAppSelector((state) => state.app.listItems);

  const onSubmit = () => {
    dispatch(addItem({ label: inputValue, responses: [] }));
    setInputValue('');
  }
  const handleDone = () => {
    router.push('/');
  }

  useEffect(() => {
    dispatch(loadStore());
  }, []);

  return (
    <VStack style={styles.stack}>
      <HStack w="$full" justifyContent="space-between" p="$3">
        <Heading>Edit</Heading>
        <Link href="/" asChild>
          <Button borderRadius="$full" size="lg" p="$3">
            <ButtonIcon as={ArrowLeftIcon} />
          </Button>
        </Link>
      </HStack>
      <ScrollView>
        <Input variant="outline" size="md">
          <InputField placeholder="Add new signal here" value={inputValue} onChangeText={(text) => setInputValue(text)} onSubmitEditing={onSubmit} />
        </Input>
        {list.map((item) => (
          <DisplayListItem id={item.id} key={item.id} />
        ))}
      </ScrollView>
      <Button size="md" variant="solid" action="primary" onPress={handleDone}>
        <ButtonText>Done</ButtonText>
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: '100%',
    maxWidth: 400,
    margin: 'auto',
    height: '100%',
    padding: 20,
  },
});
