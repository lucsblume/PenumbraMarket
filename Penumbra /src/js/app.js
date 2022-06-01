App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Carregando NFTS.
    $.getJSON('../NFTS.json', function(data) {
      var nftsRow = $('#nftsRow');
      var nftTemplate = $('#nftTemplate');

      for (i = 0; i < data.length; i ++) {
        nftTemplate.find('.panel-title').text(data[i].name);
        nftTemplate.find('img').attr('src', data[i].picture);
        nftTemplate.find('.nft-Description').text(data[i].Description);
        nftTemplate.find('.nft-Preco').text(data[i].Preco);
        nftTemplate.find('.pet-location').text(data[i].location);
        nftTemplate.find('.btn-buy').attr('data-id', data[i].id);

        nftsRow.append(nftTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Solicita acesso à conta
        await window.ethereum.enable();
      } catch (error) {
        // Acesso à conta negado pelo usuário
        console.error("Acesso a conta negado pelo usuário")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // Se nenhuma instância web3 injetada for detectada, volte para Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Market.json', function(data) {
      // Obtenha o arquivo de artefato de contrato necessário e instancie-o com trufa-contrato
      var MarketArtifact = data;
      App.contracts.Market = TruffleContract(MarketArtifact);

      // Defina o provedor para o contrato
      App.contracts.Market.setProvider(App.web3Provider);

      // Use nosso contrato para recuperar e marcar os animais de nfts comprados
      return App.markComprado();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleComprado);
  },

  markComprado: function(itens, account) {
    var marketInstance;

    App.contracts.Market.deployed().then(function(instance) {
      marketInstance = instance;

      return marketInstance.getItens.call();
    }).then(function(itens) {
      for (i = 0; i < itens.length; i++) {
        if (itens[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-nft').eq(i).find('button').text('Adquirido!').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleComprado: function(event) {
    event.preventDefault();

    var nftId = parseInt($(event.target).data('id'));

    var marketInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Market.deployed().then(function(instance) {
        marketInstance = instance;

        // Executa a compra como uma transação enviando conta
        return marketInstance.comprar(nftId, {from: account});
      }).then(function(result) {
        return App.markComprado();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});