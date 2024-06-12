import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, Heading } from '@gluestack-ui/themed';

export default function Drawer({showDrawer, handleClose}: {showDrawer: boolean, handleClose: () => void}) {
  const responseItems = useAppSelector((state) => state.app.responseItems);
  const [displayItems, setDisplayItems] = useState<string[]>([]);

  useEffect(() => {
    setDisplayItems(responseItems.filter((item) => item.count > 0).map((item) => item.label));
  }, [responseItems]);

  return (
    <Actionsheet isOpen={showDrawer} onClose={handleClose} zIndex={999} snapPoints={[80]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Heading p="$5">Try doing these</Heading>
        {displayItems.map((item) => (
          <ActionsheetItem key={item}>
            <ActionsheetItemText>{item}</ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
}