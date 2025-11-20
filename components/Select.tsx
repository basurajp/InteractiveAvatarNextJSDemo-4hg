import * as SelectPrimitive from "@radix-ui/react-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";

import { ChevronDownIcon, CloseIcon } from "./Icons";
import { useIsMobile } from "./logic/useMediaQuery";

interface SelectProps<T> {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  isSelected: (option: T) => boolean;
  value: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
}

export function Select<T>(props: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (option: T) => {
    props.onSelect(option);
    setIsOpen(false);
  };

  // Mobile view pattern mode (bottom sheet modal)
  if (isMobile) {
    return (
      <>
        <button
          type="button"
          disabled={props.disabled}
          onClick={() => setIsOpen(true)}
          className="w-full text-white text-sm bg-zinc-700 py-2 px-6 rounded-lg cursor-pointer flex items-center justify-between h-fit disabled:opacity-50 min-h-[44px]"
        >
          <div className={`${props.value ? "text-white" : "text-zinc-400"}`}>
            {props.value ? props.value : props.placeholder}
          </div>
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
            <DialogPrimitive.Content className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 rounded-t-xl border-t border-zinc-700 max-h-[80vh] flex flex-col transition-transform duration-300 data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full">
              <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                <DialogPrimitive.Title className="text-white text-lg font-semibold">
                  {props.placeholder || "Select an option"}
                </DialogPrimitive.Title>
                <DialogPrimitive.Close className="text-zinc-400 hover:text-white transition-colors">
                  <CloseIcon className="w-5 h-5" />
                </DialogPrimitive.Close>
              </div>
              <div className="overflow-y-auto flex-1">
                {props.options.map((option) => {
                  const isSelected = props.isSelected(option);

                  return (
                    <button
                      key={props.renderOption(option)?.toString()}
                      type="button"
                      className={`w-full py-4 px-6 text-left text-sm min-h-[44px] flex items-center ${
                        isSelected
                          ? "text-white bg-zinc-700"
                          : "text-zinc-400 hover:bg-zinc-700/50"
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {props.renderOption(option)}
                    </button>
                  );
                })}
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </>
    );
  }

  // Desktop popper mode
  return (
    <SelectPrimitive.Root
      disabled={props.disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectPrimitive.Trigger className="w-full text-white text-sm bg-zinc-700 py-2 px-6 rounded-lg cursor-pointer flex items-center justify-between h-fit disabled:opacity-50 min-h-[36px]">
        <div className={`${props.value ? "text-white" : "text-zinc-400"}`}>
          {props.value ? props.value : props.placeholder}
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto"
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.Viewport className="rounded-lg border border-zinc-600 bg-zinc-700 shadow-lg py-1">
            {props.options.map((option) => {
              const isSelected = props.isSelected(option);

              return (
                <div
                  key={props.renderOption(option)?.toString()}
                  className={`py-2 px-4 cursor-pointer hover:bg-zinc-600 outline-none text-sm ${
                    isSelected ? "text-white bg-zinc-500" : "text-zinc-400"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {props.renderOption(option)}
                </div>
              );
            })}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
