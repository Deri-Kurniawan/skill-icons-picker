"use client";

import { useState } from "react";

interface DisclosureActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useDisclosure = (
  initialState: boolean = false
): [boolean, DisclosureActions] => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  return [isOpen, { open: onOpen, close: onClose, toggle: onToggle }];
};

export default useDisclosure;
