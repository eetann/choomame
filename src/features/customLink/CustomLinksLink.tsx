import { Param } from "../param/param";
import { CustomLinks } from "./customLinkSchema";
import { VStack, Text, Link, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  param: Param;
};

const CustomLinksLink: React.FC<Props> = ({ param }) => {
  const [customLinks, setCustomLinks] = useState<CustomLinks>([]);

  useEffect(() => {
    (async () => {
      // let links = await hoge();
      const links = [
        {
          id: "abc",
          name: "abc",
          url: "https://www.google.com",
          match: "javascript|js",
          group: "ABCDEF",
          enable: true,
        },
        {
          id: "def",
          name: "def",
          url: "https://www.google.com",
          match: "javascript|js",
          group: "ABCDEF",
          enable: true,
        },
        {
          id: "aaaaaaaaaaa",
          name: "ああああああああああああああああああああああああ",
          url: "https://www.google.co.jp",
          match: ".*",
          group: "なんでも",
          enable: true,
        },
        {
          id: "aaaaaaaaaa1",
          name: "ああああああああああああああああああああああああ",
          url: "https://www.google.co.jp",
          match: ".*",
          group: "EEEEEEEE",
          enable: true,
        },
        {
          id: "aaaaaaaaaa2",
          name: "ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
          url: "https://www.google.co.jp",
          match: ".*",
          group: "なんでも",
          enable: true,
        },
        {
          id: "aaaaaaaaaa3",
          name: "最後-1",
          url: "https://www.google.co.jp",
          match: ".*",
          group: "なんでも",
          enable: true,
        },
        {
          id: "aaaaaaaaaa4",
          name: "最後",
          url: "https://www.google.co.jp",
          match: ".*",
          group: "なんでも",
          enable: true,
        },
      ];
      setCustomLinks(links);
    })();
  }, []);

  return (
    <VStack
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
      {Object.entries(
        customLinks.reduce(
          (linksByGroup: Record<string, JSX.Element[]>, customLink) => {
            const { group } = customLink;
            linksByGroup[group] = linksByGroup[group] ?? [];
            linksByGroup[group].push(
              <Link
                key={customLink.id}
                href={customLink.url}
                color="teal"
                _visited={{
                  color: "purple",
                }}
              >
                {customLink.name}
              </Link>
            );
            return linksByGroup;
          },
          {}
        )
      ).map(([group, links]) => (
        <Box key={group}>
          <Text as="b">{group}</Text>
          <VStack alignItems="start">{links}</VStack>
        </Box>
      ))}
    </VStack>
  );
};
export default CustomLinksLink;
