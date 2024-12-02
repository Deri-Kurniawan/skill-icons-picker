import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { IconClipboard, IconClipboardFill } from "justd-icons";
import React, { FC, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type CodeBlockProps = React.HTMLProps<HTMLDivElement> & {
  copyText?: string | null;
};

const CodeBlock: FC<CodeBlockProps> = ({
  copyText = null,
  children,
  className,
  ...props
}) => {
  const [copied, handlerCopied] = useDisclosure(false);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (copied) {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
      }

      cooldownRef.current = setTimeout(() => {
        handlerCopied.close();
      }, 1000);
    }
  }, [copied, handlerCopied]);

  const copyToClipboard = () => {
    handlerCopied.open();

    navigator.clipboard.writeText(copyText as string);
  };

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <pre className="w-full p-4 pr-24 overflow-x-auto font-mono text-sm bg-secondary rounded-lg max-h-20">
        <code className="w-full">{children}</code>
      </pre>
      {copyText && (
        <TooltipProvider>
          <Tooltip open={copied}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute -translate-y-1/3 right-4 top-1/3"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <IconClipboardFill className="size-8" />
                ) : (
                  <IconClipboard className="size-8" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Copied!</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default CodeBlock;
