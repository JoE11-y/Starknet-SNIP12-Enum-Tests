use core::hash::{HashStateExTrait, HashStateTrait};
use core::poseidon::PoseidonTrait;
use openzeppelin_utils::snip12::StructHash;

pub const SIMPLE_STRUCT_TYPE_HASH: felt252 = selector!(
    "\"SimpleStruct\"(\"some_enum\":\"ItemType\")\"ItemType\"(\"NATIVE\":(),\"ERC20\":(),\"ERC721\":(),\"ERC1155\":())",
);

#[derive(Debug, Drop, Copy, Serde, PartialEq, Hash, starknet::Store)]
pub enum ItemType {
    #[default]
    NATIVE, // STRK
    ERC20,
    ERC721,
    ERC1155,
}

#[derive(Drop, Copy, Hash)]
pub struct SimpleStruct {
    pub some_enum: ItemType,
}

// Passing Hash
#[generate_trait]
impl CorrectHashImpl of StructHash2 {
    fn hash_struct_correct(self: @SimpleStruct) -> felt252 {
        let mut state_2 = PoseidonTrait::new();
        state_2 = state_2.update_with(0);
        state_2 = state_2.update_with('');
        let final_hash = state_2.finalize();

        let mut state = PoseidonTrait::new();
        state = state.update_with(SIMPLE_STRUCT_TYPE_HASH);
        state = state.update_with(final_hash);
        state.finalize()
    }
}

// Failing Hash
impl StructHashSimpleStruct of StructHash<SimpleStruct> {
    fn hash_struct(self: @SimpleStruct) -> felt252 {
        let mut state = PoseidonTrait::new();
        state = state.update_with(SIMPLE_STRUCT_TYPE_HASH);
        state = state.update_with(*self);
        state.finalize()
    }
}

#[cfg(test)]
mod tests {
    use openzeppelin_utils::snip12::{SNIP12Metadata, StructHash};
    use super::{ItemType, SimpleStruct, StructHash2};

    /// Required for hash computation.
    impl SNIP12MetadataImpl of SNIP12Metadata {
        fn name() -> felt252 {
            'DappName'
        }
        fn version() -> felt252 {
            1
        }
    }

    #[test]
    #[should_panic]
    fn test_struct_hash_mismatch() {
        // This value was computed using StarknetJS
        let expected_hash = 0xb2235f12b8e4a5abbd39dcef201ff24644f5251f631c4ee68ca659af7ffe9e;
        let simple_struct = SimpleStruct { some_enum: ItemType::NATIVE };
        let actual_hash = simple_struct.hash_struct();
        assert_eq!(actual_hash, expected_hash, "not match");
    }

    #[test]
    fn test_struct_hash_matches() {
        // This value was computed using StarknetJS
        let expected_hash = 0xb2235f12b8e4a5abbd39dcef201ff24644f5251f631c4ee68ca659af7ffe9e;
        let simple_struct = SimpleStruct { some_enum: ItemType::NATIVE };
        let actual_hash = simple_struct.hash_struct_correct();
        assert_eq!(actual_hash, expected_hash, "not match");
    }
}
