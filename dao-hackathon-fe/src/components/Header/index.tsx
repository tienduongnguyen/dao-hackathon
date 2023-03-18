import NextLink from "next/link";
import {
  Flex,
  Button,
  Spacer,
  Heading,
  LinkBox,
  LinkOverlay,
  Image,
  Text,
} from "@chakra-ui/react";
import {useGlobalState } from '../../store'
import { blockchainService } from "services";

export default function Header() {
  const [connectedAccount] = useGlobalState('connectedAccount');
  const formatDisplayAccount = ()=>{
    if(!connectedAccount) return "";
    return connectedAccount.substring(0,4) + "..." + connectedAccount.substring(connectedAccount.length-5);
  }

  return (
    <Flex
      as="header"
      bg="rgba(46, 26, 84, 0.5)"
      alignItems="center"
      h="98px"
    >
      <LinkBox className="header" ml="160px">
        <NextLink href={"/"} passHref>
          <LinkOverlay>
            <Heading size="md">
              <Image src="/images/mesme-logo.svg" w="200px" h="66px" alt=""/>
            </Heading>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
      <Spacer />
      {connectedAccount? <Flex flexDirection="row" gap="8px" mr="160px" color="#FFFFFF" fontSize="16px" w="166px" h='44px' bg="#7D31AF" p="4px 8px" borderRadius="100px" align="center"><Image boxSize="36px" src="/images/metamask-icon.svg"></Image><Text>{formatDisplayAccount()}</Text></Flex>:
      <Button mr="160px" color="#FFFFFF" fontSize="16px" w="166px" h='44px' bg="#7D31AF" borderRadius="100px" onClick={()=>blockchainService.connectWallet()}>Connect Wallet</Button>
       }  
    </Flex>
  );
}
