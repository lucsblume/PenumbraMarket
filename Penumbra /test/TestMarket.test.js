const Market = artifacts.require("Market");

contract("Market", (accounts) => {
  let market;
  let expectedIten;

  before(async () => {
      market = await Market.deployed();
  });

  describe("Comprar um NFT e recuperar endereços de contas", async () => {
    before("Compre uma NFT usando contas[0]", async () => {
      await market.comprar(8, { from: accounts[0] });
      expectedIten = accounts[0];
    });

    it("pode buscar a coleção de endereços de todos os proprietários de NFTS", async () => {
        const itens = await market.getItens();
        assert.equal(itens[8], expectedIten, "O proprietário dos NFTS adquiridos deve estar na coleção");
      });
  });
});