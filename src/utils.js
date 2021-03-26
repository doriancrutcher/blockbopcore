import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  Account,
  utils,
} from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig( "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  window.utils = utils;

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();
  window.account = new Account(near.connection, accountId);
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        "get_greeting",
        "getUserName",
        "get_ipfs_key",
        "getTwitchName",
        "getNearName",
        "get_user_name_list",
        "get_likes",
        "get_dislikes",
        "get_listens",
      ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [
        "set_greeting",
        "setNewUserName",
        "set_IPFS_Keys",
        "setTwitchName",
        "setNearName",
        "addUserNameToRegistry",
        "add_user_name_to_registry",
        "add_to_likes",
        "add_to_dislikes",
        "add_listens",
        "sub_listens",
        "transfer_listens",
      ],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn("");
}
