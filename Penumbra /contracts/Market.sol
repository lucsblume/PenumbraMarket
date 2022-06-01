pragma solidity 0.5.16;

contract Market {
    address[16] public itens;

    function comprar(uint256 nftId) public returns (uint256) {
        require(nftId >= 0 && nftId <= 15);

        itens[nftId] = msg.sender;

        return nftId;
    }

    function getItens() public view returns (address[16] memory) {
  return itens;
}
}

/*
pragma solidity >=0.4.22 <0.8.14;

contract Market {
    struct Item {
        uint256 id;
        string nome;
        string descricao;
        uint256 valor;
        uint256 status; //0 = item registrado à venda 1 = status livre 2 = status livre 3 = compra solicitada 4 = Item em halt 5 = Item comprado
        string img;
        address payable vendedor;
        address comprador;  
    }
    uint256 public index;
    Item[] public items;

    constructor() {
        index = 0;
    }

    function addItem(
        string memory _nome,
        string memory _descricao,
        uint256 _valor,
        string memory _img
    ) public {
        require(bytes(_nome).length > 0, "The name cannot be empty");
        require(
            bytes(_descricao).length > 0,
            "The description cannot be empty"
        );
        require(_valor > 0, "The price cannot be empty");
        require(bytes(_img).length > 0, "The image cannot be empty");

        Item memory _item = Item({
            id: index,
            nome: _nome,
            descricao: _descricao,
            valor: _valor,
            status: 0,
            img: _img,
            vendedor: payable(msg.sender),
            comprador: address(0)
        });
        
        items.push(_item);
        index++;
    }

    function buyItem(uint256 _id) public payable {
        require(_id >= 0, "The ID can't be negative");

        bool doesListContainElement = false;
        uint indice = 0;
        for (uint i = 0; i < items.length; i++) {
            if (_id == items[i].id) {
                doesListContainElement = true;
                indice = i;
                break;
            }
        }
        require(items[indice].comprador == address(0), "O item nao esta disponivel");
        require(items[indice].vendedor != msg.sender, "O vendedor nao pode ser o comprador");
        require(items[indice].status == 0, "O item nao esta disponivel");
        require(msg.value == items[indice].valor);
        if (doesListContainElement) {
            items[indice].status = 3;
            //require(msg.value == items[indice].valor wei);
            //payable(address(this)).transfer(items[indice].valor);
            items[indice].vendedor.transfer(msg.value);
            //items[indice].vendedor.send(items[indice].valor);
            items[indice].comprador = msg.sender;
            items[indice].status = 5;
        }          
    }

    function editItem(
        uint256 _id,
        string memory _nome,
        string memory _descricao,
        uint256 _valor,
        string memory _img,
        uint256 _status
    ) public {
        require(_id >= 0, "The ID can't be negative");
        require(bytes(_nome).length > 0, "The name cannot be empty");
        require(
            bytes(_descricao).length > 0,
            "The description cannot be empty"
        );
        require(_valor > 0, "The price cannot be empty");
        require(bytes(_img).length > 0, "The image cannot be empty");
        require(_status >= 0 && _status < 5, "Invalid status code");

        bool doesListContainElement = false;
        uint indice = 0;
        for (uint i = 0; i < items.length; i++) {
            if (_id == items[i].id) {
                doesListContainElement = true;
                indice = i;
                break;
            }
        }
        require(items[indice].vendedor == msg.sender, "Apenas o vendedor pode alterar o item");
        if (doesListContainElement) {
            items[indice].nome = _nome;
            items[indice].descricao = _descricao;
            items[indice].valor = _valor;
            items[indice].img = _img;
            items[indice].status = _status;
            items[indice].comprador = address(0);
        }
    }
*/