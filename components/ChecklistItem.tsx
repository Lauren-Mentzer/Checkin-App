import React, { useEffect, useState } from 'react';
import {
  Card,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  HStack,
  Pressable,
  Text,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { CheckIcon } from "lucide-react-native";

export default function ChecklistItem({ label, checked, onClick }: { label: string, checked: boolean, onClick: () => void }) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Pressable onPress={onClick}>
      <Card size="md" m="$1" variant="elevated" style={isChecked ? styles.checked : null}>
        <HStack justifyContent="space-between">
          <Text>{ label }</Text>
          <Checkbox size="lg" value="-" isChecked={isChecked} aria-label={label} onPress={onClick}>
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
        </HStack>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checked: {
    backgroundColor: 'aliceblue',
    transform: 'scale(.98)', 
  },
});
