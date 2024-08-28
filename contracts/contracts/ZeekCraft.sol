// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ZeekCraft is ERC721 {
    uint256 public nextRecipeId = 1;
    uint256 public constant RECIPE_MINT_COST = 100 * 10 ** 18; // 100 ZeekCraft tokens
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 18; // 1000 ZeekCraft tokens
    uint256 public constant FAUCET_COOLDOWN = 1 days;

    address public owner;

    struct Recipe {
        uint256 id1;
        uint256 id2;
        string name;
        string emojiName;
        address creator;
    }

    mapping(uint256 => Recipe) public recipes;
    mapping(uint256 => mapping(uint256 => uint256)) public recipeIdByIngredients;
    mapping(address => uint256) public lastFaucetRequest;
    mapping(address => uint256[]) public userRecipes;

    event RecipeCreated(
        uint256 indexed recipeId, uint256 id1, uint256 id2, string name, string emojiName, address creator
    );
    event FaucetRequested(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() ERC721("ZeekCraft Recipe", "ZCR") {
        owner = msg.sender;
    }

    function createRecipe(uint256 _id1, uint256 _id2, string memory _name, string memory _emojiName) external {
        // require(zeekToken.balanceOf(msg.sender) >= RECIPE_MINT_COST, "Not enough ZeekCraft tokens");
        // require(zeekToken.transferFrom(msg.sender, address(this), RECIPE_MINT_COST), "Token transfer failed");

        require(_id1 != _id2, "Ingredients must be different");
        require(recipeIdByIngredients[_id1][_id2] == 0, "Recipe already exists");

        uint256 recipeId = nextRecipeId++;
        recipes[recipeId] = Recipe(_id1, _id2, _name, _emojiName, msg.sender);
        recipeIdByIngredients[_id1][_id2] = recipeId;
        recipeIdByIngredients[_id2][_id1] = recipeId; // Store recipe for both ingredient orders

        _mint(msg.sender, recipeId);
        userRecipes[msg.sender].push(recipeId);

        emit RecipeCreated(recipeId, _id1, _id2, _name, _emojiName, msg.sender);
    }

    function getRecipe(uint256 _recipeId) external view returns (Recipe memory) {
        return recipes[_recipeId];
    }

    function getRecipeIdByIngredients(uint256 _id1, uint256 _id2) external view returns (uint256) {
        return recipeIdByIngredients[_id1][_id2];
    }

    function getUserRecipes(address _user) external view returns (uint256[] memory) {
        return userRecipes[_user];
    }

    function getAllRecipes() external view returns (Recipe[] memory) {
        Recipe[] memory allRecipes = new Recipe[](nextRecipeId - 1);
        for (uint256 i = 1; i < nextRecipeId; i++) {
            allRecipes[i - 1] = recipes[i];
        }
        return allRecipes;
    }
}
