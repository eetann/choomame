import { Param } from "../param/param";
import {
  customLinkItemBucket,
  toGoogleWithUrl,
  toMatchWithDelimiter,
} from "./customLink";
import { VStack, Heading, Link, Box, HStack, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiOutlineFilter } from "react-icons/hi";

type Props = {
  param: Param;
};

const CustomLinkItemLink: React.FC<Props> = ({ param }) => {
  const [itemsByGroup, setItemsByGroup] = useState<
    Record<string, JSX.Element[]>
  >({});

  useEffect(() => {
    (async () => {
      const bucket = await customLinkItemBucket.get();
      const groupItems: Record<string, JSX.Element[]> = {};
      Object.values(bucket).forEach((customLink) => {
        if (!customLink.enable) {
          return;
        }

        const query = toMatchWithDelimiter(customLink.match);
        if (!query.test(param.q)) {
          return;
        }

        const { group } = customLink;
        groupItems[group] = groupItems[group] ?? [];

        // replace %s to keyword
        const keyword = encodeURIComponent(param.q.replace(query, "").trim());
        if (/%s/.test(customLink.url)) {
          groupItems[group].push(
            <Link
              key={customLink.id}
              href={customLink.url.replace(/%s/, keyword)}
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
  }, [param.q]);

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
