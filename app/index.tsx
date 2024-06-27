
import ChecklistItem from "@/components/ChecklistItem";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearChecked, clickItem, loadStore } from "../store/slice";
import Drawer from "@/components/Drawer";
import { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { EditIcon } from "lucide-react-native";
import notifee from '@notifee/react-native';

export default function Home() {
  const dispatch = useAppDispatch();
  const listItems = useAppSelector((state) => state.app.listItems);
  const [showDrawer, setShowDrawer] = useState(false);
  const onItemCheck = (id: string) => {
    dispatch(clickItem(id));
  }
  const onButtonPress = () => {
    const count = listItems.filter((item) => item.checked);
    if (count.length > 0) setShowDrawer(true);
  }
  const handleClose = () => {
    setShowDrawer(false);
    dispatch(clearChecked());
  }
  const onDisplayNotification = async () => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: "It's been an hour!",
      body: "Let's do a checkin with our body",
      android: { channelId, pressAction: { id: 'default' } },
    })
  }
  useEffect(() => {
    dispatch(loadStore());
  }, []);
  return (
    <VStack style={styles.stack}>
      <HStack w="$full" justifyContent="space-between" p="$3">
        <Heading>Check-in</Heading>
        <Link href="/setup" asChild>
          <Button borderRadius="$full" size="lg" p="$3">
            <ButtonIcon as={EditIcon} />
          </Button>
        </Link>
      </HStack>
      {listItems.length > 0 && (
        <ScrollView>
          { listItems.map((dataItem) => (<ChecklistItem key={dataItem.id} label={dataItem.label} checked={dataItem.checked} onClick={() => onItemCheck(dataItem.id)} />)) }
          <Button size="md" variant="solid" m="$1" onPress={onButtonPress}>
            <ButtonText>That's All</ButtonText>
          </Button>
        </ScrollView>
      )}
      {listItems.length == 0 && (
        <Center flex={1}>
          <Text m="$1">You don't have any items</Text>
          <Link href='/setup' asChild>
            <Button size="md" variant="solid" m="$1">
              <ButtonText>Add some checklist items</ButtonText>
            </Button>
          </Link>
        </Center>
      )}
      <Button onPress={onDisplayNotification}><ButtonText>Test notification</ButtonText></Button>
      <Drawer showDrawer={showDrawer} handleClose={handleClose} />
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
