import {
  customLinkItemBucket,
  toGoogleWithUrl,
  toMatchWithDelimiter,
} from "./customLink";
import { CustomLinkItemBucket } from "./customLinkSchema";
import { VStack, Heading, Link, Box, HStack, Tooltip } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, MouseEvent } from "react";
import { HiOutlineFilter } from "react-icons/hi";

type Props = {
  paramQuery: string;
  isInPopup: boolean;
};

const CustomLinkItemLink: React.FC<Props> = ({ paramQuery, isInPopup }) => {
  const [itemsByGroup, setItemsByGroup] = useState<
    Record<string, JSX.Element[]>
  >({});
  const [bucket, setBucket] = useState<CustomLinkItemBucket>({});

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!isInPopup) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (!(event.target instanceof HTMLAnchorElement)) {
        return;
      }
      chrome.tabs.create({ url: event.target.href });
    },
    [isInPopup]
  );

  useEffect(() => {
    (async () => {
      const bucket = await customLinkItemBucket.get();
      setBucket(bucket);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const groupItems: Record<string, JSX.Element[]> = {};
      Object.values(bucket).forEach((customLink) => {
        if (!customLink.enable) {
          return;
        }

        const query = toMatchWithDelimiter(customLink.match);
        if (!query.test(paramQuery)) {
          return;
        }

        const { group } = customLink;
        groupItems[group] = groupItems[group] ?? [];

        // replace %s to keyword
        const keyword = encodeURIComponent(
          paramQuery.replace(query, " ").trim()
        );
        if (/%s/.test(customLink.url)) {
          groupItems[group].push(
            <Link
              onClick={handleClick}
              tabIndex={3}
              key={customLink.id}
              href={
                customLink.match === ".*"
                  ? customLink.url.replace(/%s/, paramQuery)
                  : customLink.url.replace(/%s/, keyword)
              }
              color="teal"
              _visited={{
                color: "purple",
              }}
            >
              {customLink.name}
            </Link>
          );
          return;
        }
        groupItems[group].push(
          <HStack key={customLink.id} spacing="3">
            <Link
              onClick={handleClick}
              tabIndex={3}
              href={customLink.url}
              color="teal"
              _visited={{
                color: "purple",
              }}
            >
              {customLink.name}
            </Link>
            <Tooltip label="Google the site only">
              <Link
                onClick={handleClick}
                tabIndex={3}
                href={toGoogleWithUrl(customLink.url, keyword)}
                color="teal"
                _visited={{
                  color: "purple",
                }}
              >
                <HiOutlineFilter />
              </Link>
            </Tooltip>
          </HStack>
        );
      });
      setItemsByGroup(groupItems);
    })();
  }, [bucket, handleClick, paramQuery]);

  return (
    <VStack
      id="choomameCustomItemLink"
      className="no-drag-area"
      cursor="auto"
      mb="2"
      p="2"
      boxShadow="base"
      rounded="md"
      backgroundColor="whiteAlpha.700"
      backdropBlur="2xl"
      alignItems="start"
      overflowY="auto"
      sx={{
        "--scrollbarBG": "#CFD8DC",
        "--thumbBG": "#90A4AE",
        "&::-webkit-scrollbar": {
          height: "8px",
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          height: "10px",
          width: "10px",
          background: "var(--scrollbarBG)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--thumbBG)",
          borderRadius: "12px",
          border: "2px solid var(--scrollbarBG)",
        },
      }}
    >
      {Object.entries(itemsByGroup).map(([group, items]) => (
        <Box key={group}>
          <Heading size="xs" mt="2" mb="1">
            {group}
          </Heading>
          <VStack alignItems="start" spacing="2">
            {items}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
export default CustomLinkItemLink;
