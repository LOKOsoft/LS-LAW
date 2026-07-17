"use client";

import * as React from "react";

export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  const onOpen = React.useCallback(() => setIsOpen(true), []);
  const onClose = React.useCallback(() => setIsOpen(false), []);
  const onToggle = React.useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, onOpen, onClose, onToggle, onOpenChange: setIsOpen };
}
