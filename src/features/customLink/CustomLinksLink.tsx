import { Param } from "../param/param";
import { getCustomLinks } from "./customLink";
import { VStack, Heading, Link, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  param: Param;
};

const CustomLinksLink: React.FC<Props> = ({ param }) => {
  const [linksByGroup, setLinksByGroup] = useState<
    Record<string, JSX.Element[]>
  >({});

  useEffect(() => {
    (async () => {
      const bucket = await getCustomLinks();
      const links: Record<string, JSX.Element[]> = {};
      Object.values(bucket).forEach((customLink) => {
        const { group } = customLink;
        if (!new RegExp(customLink.match).test(param.q) || !customLink.enable) {
          return;
        }
        links[group] = links[group] ?? [];
        links[group].push(
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
      });
      setLinksByGroup(links);
    })();
  }, [param.q]);

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
      {Object.entries(linksByGroup).map(([group, links]) => (
        <Box key={group}>
          <Heading size="xs" mt="2" mb="1">
            {group}
          </Heading>
          <VStack alignItems="start" spacing="2">
            {links}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
export default CustomLinksLink;
