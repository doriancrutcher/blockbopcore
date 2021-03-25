/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen};
use std::collections::HashMap;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct BlockBopRecords {
    userNames: HashMap<String, String>,
    nearNames: HashMap<String, String>,
    twitchNames: HashMap<String, String>,
    listensRecord: HashMap<String, u64>,
    ipfsStorageKeys: HashMap<String, String>,
    twitchHandleStorage: HashMap<String, String>,
    userNameTracker: HashMap<String, Vec<String>>,
    likeStore: HashMap<String, HashMap<String, i32>>,
    dislikeStore: HashMap<String, HashMap<String, i32>>,
    listensStore: HashMap<String, i32>,
    records: HashMap<String, String>,
}

#[near_bindgen]
impl BlockBopRecords {
    pub fn add_listens(&mut self, displayName: String, listens: i32) {
        if (self.listensStore.contains_key(&displayName)) {
            let mut curr_listens: i32 = match self.listensStore.get(&displayName) {
                Some(amount) => amount.clone(),
                None => 0,
            };
            curr_listens = curr_listens + listens;
            self.listensStore.insert(displayName.into(), curr_listens);
        } else {
            self.listensStore.insert(displayName, listens);
        }
    }

    pub fn sub_listens(&mut self, displayName: String, listens: i32) {
        if (self.listensStore.contains_key(&displayName)) {
            let mut curr_listens: i32 = match self.listensStore.get(&displayName) {
                Some(amount) => amount.clone(),
                None => 0,
            };
            if (curr_listens < listens) {
                println!("not enough listens");
            } else {
                curr_listens = curr_listens - listens;
                self.listensStore.insert(displayName.into(), curr_listens);
            }
        } else {
            println!("user not found")
        }
    }

    pub fn get_listens(&self, displayName: String) -> i32 {
        if (self.listensStore.contains_key(&displayName)) {
            match self.listensStore.get(&displayName) {
                Some(listensTotal) => listensTotal.clone(),
                None => 0,
            }
        } else {
            let x: i32 = 0;
            x
        }
    }

    pub fn transfer_listens(&mut self, sender: String, recipient: String, listens: i32) {
        if (self.get_listens(sender.clone()) > listens) {
            self.sub_listens(sender.clone(), listens.clone());
            self.add_listens(recipient.clone(), listens.clone());
        };
    }

    pub fn set_greeting(&mut self, message: String) {
        let account_id = env::signer_account_id();

        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving greeting '{}' for account '{}'", message, account_id,).as_bytes());

        self.records.insert(account_id, message);
    }

    // `match` is similar to `switch` in other languages; here we use it to default to "Hello" if
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_greeting(&self, account_id: String) -> &str {
        match self.records.get(&account_id) {
            Some(greeting) => greeting,
            None => "Hello",
        }
    }
    // This is not a secure way to store a user's key.
    // only to be used for development purposes until a proper backend has been made to store the key in an environment variable
    pub fn set_IPFS_Keys(&mut self, artistName: String, ipfsKey: String) {
        println!("{:}", env::signer_account_id());
        self.ipfsStorageKeys.insert(artistName, ipfsKey);
    }

    pub fn get_ipfs_key(&self, artistName: String) -> &str {
        match self.ipfsStorageKeys.get(&artistName) {
            Some(ipfsKey) => ipfsKey,
            None => "No Key Retrieved",
        }
    }

    pub fn setNewUserName(&mut self, displayName: String) {
        self.userNames.insert(env::signer_account_id(), displayName);
    }

    pub fn getUserName(&self, nearName: String) -> &str {
        match self.userNames.get(&nearName) {
            Some(name) => name,
            None => "no name retrieved",
        }
    }

    pub fn setNearName(&mut self, displayName: String) {
        self.nearNames.insert(displayName, env::signer_account_id());
    }

    pub fn getNearName(&self, displayName: String) -> &str {
        match self.nearNames.get(&displayName) {
            Some(name) => name,
            None => "no name found",
        }
    }

    pub fn setTwitchName(&mut self, twitchName: String) {
        self.twitchHandleStorage
            .insert(env::signer_account_id(), twitchName);
    }

    pub fn getTwitchName(&self, accountId: String) -> &str {
        match self.twitchHandleStorage.get(&accountId) {
            Some(name) => name,
            None => "no twitch handle retreived",
        }
    }

    pub fn get_user_name_list(&self) -> Vec<String> {
        let res = vec![];
        match self.userNameTracker.get("blockbop") {
            Some(list) => (&list).to_vec(),
            None => res,
        }
    }

    pub fn add_user_name_to_registry(&mut self, userName: String) {
        // let mut nameList: Vec<String> = &self.get_user_name_list();
        // let mut userArray = Vec::new();

        if (self.userNameTracker.contains_key("blockbop")) {
            let mut nameList = &mut self.get_user_name_list();

            nameList.push(userName);
            self.userNameTracker
                .insert(String::from("blockbop"), (&nameList).to_vec());
        } else {
            self.userNameTracker
                .insert(String::from("blockbop"), vec![userName]);
        }
    }

    // fn get_artists_song_like_list(&self, artistName: String) {
    //     match self.likeStore.get(&artistName) {
    //         Some(songList) => songList,
    //         None => println!("there is nothing to be found "),
    //     }
    // }

    pub fn add_to_likes(&mut self, artistName: String, songName: String) {
        let mut y = HashMap::new();
        let z = String::from("Null");
        let x: i32 = 0;
        y.insert(z, x);
        if (self.likeStore.contains_key(&artistName)) {
            let mut artist_song_hashmap: HashMap<String, i32> =
                match self.likeStore.get(&artistName) {
                    Some(songList) => songList.clone(),
                    None => y,
                };

            if (artist_song_hashmap.contains_key(&songName)) {
                let zero_val: i32 = 0;
                let mut like_count: i32 = match artist_song_hashmap.get(&songName) {
                    Some(count) => count.clone(),
                    None => zero_val,
                };
                let add_one_like: i32 = 1;

                like_count = like_count + add_one_like;
                artist_song_hashmap.insert(songName.into(), like_count);

                self.likeStore
                    .insert(artistName.into(), artist_song_hashmap);
            } else {
                let first_like: i32 = 1;
                artist_song_hashmap.insert(songName, first_like);
                self.likeStore.insert(artistName, artist_song_hashmap);
            }

            // if (&artist_song_hashmap.contains_key(songName)) {
            //     println!("{:}", artist_song_hashmap);
            // }
        } else {
            let first_like: i32 = 1;
            let mut song_hash_map = HashMap::new();
            song_hash_map.insert(songName, first_like);
            self.likeStore.insert(artistName, song_hash_map);
        }
    }
    pub fn get_likes(&self, artistName: String, songName: String) -> i32 {
        let mut y = HashMap::new();
        let z = String::from("Null");
        let x: i32 = 0;
        y.insert(z, x);
        let result: i32;

        let get_song_list = match self.likeStore.get(&artistName) {
            Some(list_of_songs) => list_of_songs.clone(),
            None => y,
        };

        if (get_song_list.contains_key(&songName)) {
            let get_song_likes = match get_song_list.get(&songName) {
                Some(likes) => likes.clone(),
                None => 0,
            };
            get_song_likes
        } else {
            0
        }
    }
    pub fn add_to_dislikes(&mut self, artistName: String, songName: String) {
        let mut y = HashMap::new();
        let z = String::from("Null");
        let x: i32 = 0;
        y.insert(z, x);
        if (self.dislikeStore.contains_key(&artistName)) {
            let mut artist_song_hashmap: HashMap<String, i32> =
                match self.dislikeStore.get(&artistName) {
                    Some(songList) => songList.clone(),
                    None => y,
                };

            if (artist_song_hashmap.contains_key(&songName)) {
                let zero_val: i32 = 0;
                let mut like_count: i32 = match artist_song_hashmap.get(&songName) {
                    Some(count) => count.clone(),
                    None => zero_val,
                };
                let add_one_like: i32 = 1;

                like_count = like_count + add_one_like;
                artist_song_hashmap.insert(songName.into(), like_count);

                self.dislikeStore
                    .insert(artistName.into(), artist_song_hashmap);
            } else {
                let first_like: i32 = 1;
                artist_song_hashmap.insert(songName, first_like);
                self.dislikeStore.insert(artistName, artist_song_hashmap);
            }

            // if (&artist_song_hashmap.contains_key(songName)) {
            //     println!("{:}", artist_song_hashmap);
            // }
        } else {
            let first_like: i32 = 1;
            let mut song_hash_map = HashMap::new();
            song_hash_map.insert(songName, first_like);
            self.dislikeStore.insert(artistName, song_hash_map);
        }
    }
    pub fn get_dislikes(&self, artistName: String, songName: String) -> i32 {
        let mut y = HashMap::new();
        let z = String::from("Null");
        let x: i32 = 0;
        y.insert(z, x);
        let result: i32;

        let get_song_list = match self.dislikeStore.get(&artistName) {
            Some(list_of_songs) => list_of_songs.clone(),
            None => y,
        };

        if (get_song_list.contains_key(&songName)) {
            let get_song_likes = match get_song_list.get(&songName) {
                Some(likes) => likes.clone(),
                None => 0,
            };
            get_song_likes
        } else {
            0
        }
    }
}

// pub fn addUserNameToRegistry(&mut self, userName: String) {
//     if (self.userNameTracker.contains_key(String::from("blockbop"))) {
//         userArray.push(userName);
//         self.userNameTracker
//             .insert(String::from("blockbop"), userArray);
//     } else {
//         self.userNameTracker
//             .insert(String::from("blockbop"), vec![userName]);
//     }
// }

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
// #[cfg(test)]
// mod tests {
//     use super::*;
//     use near_sdk::MockedBlockchain;
//     use near_sdk::{testing_env, VMContext};

//     // mock the context for testing, notice "signer_account_id" that was accessed above from env::
//     fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
//         VMContext {
//             current_account_id: "alice_near".to_string(),
//             signer_account_id: "bob_near".to_string(),
//             signer_account_pk: vec![0, 1, 2],
//             predecessor_account_id: "carol_near".to_string(),
//             input,
//             block_index: 0,
//             block_timestamp: 0,
//             account_balance: 0,
//             account_locked_balance: 0,
//             storage_usage: 0,
//             attached_deposit: 0,
//             prepaid_gas: 10u64.pow(18),
//             random_seed: vec![0, 1, 2],
//             is_view,
//             output_data_receivers: vec![],
//             epoch_height: 19,
//         }
//     }

// #[test]
// fn set_then_get_greeting() {
//     let context = get_context(vec![], false);
//     testing_env!(context);
//     let mut contract = Welcome::default();
//     contract.set_greeting("howdy".to_string());
//     assert_eq!(
//         "howdy".to_string(),
//         contract.get_greeting("bob_near".to_string())
//     );
// }

// #[test]
// fn get_default_greeting() {
//     let context = get_context(vec![], true);
//     testing_env!(context);
//     let contract = Welcome::default();
//     // this test did not call set_greeting so should return the default "Hello" greeting
//     assert_eq!(
//         "Hello".to_string(),
//         contract.get_greeting("francis.near".to_string())
//     );
// }
