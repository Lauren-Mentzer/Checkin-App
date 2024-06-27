import { CloseIcon, Button, ButtonText, ButtonIcon } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

export default function Chip({value, handleClick}: {value: string, handleClick: () => void}) {

  return (
    <Button size="lg" variant="solid" borderRadius="$full" onPress={handleClick}>
      <ButtonText>{ value }</ButtonText>
      <ButtonIcon as={CloseIcon} ml="$2" />
    </Button>
  );
}
