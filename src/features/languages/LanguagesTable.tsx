import type { AppDispatch, RootState } from "../../app/store";
import { Language, languagesKeyValue } from "./languagesSchema";
import { removeOneLanguage } from "./languagesSlice";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

const LanguagesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const languages = useSelector(
    (state: RootState) => state.languages.languages
  );

  return (
    <TableContainer rounded="md" boxShadow="xs" maxW="min-content">
      <Table variant="simple">
        <Tbody>
          {languages.reduce((prev_array: JSX.Element[], language: Language) => {
            if (language === "Any") {
              return prev_array;
            }
            prev_array.push(
              <Tr key={language}>
                <Td fontSize="md" py="1">
                  {languagesKeyValue[language]}
                </Td>
                <Td py="1" pr="1">
                  <IconButton
                    fontSize="20"
                    aria-label="Delete language"
                    icon={<HiOutlineTrash />}
                    onClick={() => dispatch(removeOneLanguage(language))}
                  />
                </Td>
              </Tr>
            );
            return prev_array;
          }, [])}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default LanguagesTable;
