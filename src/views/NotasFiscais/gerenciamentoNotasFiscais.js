import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoNotasFiscais = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([
  ]);

  useEffect(() => {
    handleClick();
  }, []);

  function handleClick() {
    axios
      .get("http://localhost:8080/nota_fiscal")
      .then(response => {
        const notas_fiscais = response.data.map(c => {
          return {
            id: c.id,
            numero_nota_fiscal: c.numero_nota_fiscal,
            nome_razao_social: c.nome_razao_social,
            data_de_emissao: c.data_de_emissao,
            data_de_entrada_saida: c.data_de_entrada_saida,
            valor_nota_fiscal: c.valor_nota_fiscal,
            cnpj: c.cnpj
          };
        });
        setData(notas_fiscais);
      })
      .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("http://localhost:8080/nota_fiscal", {
        "numero_nota_fiscal": newData.numero_nota_fiscal,
        "nome_razao_social": newData.nome_razao_social,
        "data_de_emissao": newData.data_de_emissao,
        "data_de_entrada_saida": newData.data_de_entrada_saida,
        "valor_nota_fiscal": newData.valor_nota_fiscal,
        "descricao_produto_servico": newData.descricao_produto_servico,
        "cnpj": newData.cnpj
      })
      .then(function (response) {
        console.log('Salvo com sucesso.')
      });
  }

  function handleUpdate(newData) {
    axios
      .put("http://localhost:8080/endereco", {
        "id": newData.id,
        "rua": newData.rua,
        "numero": newData.numero,
        "cep": newData.cep,
        "cidade": newData.cidade,
        "estado": newData.estado,
        "pais": newData.pais
      })
      .then(function (response) {
        console.log('Atualizado com sucesso.')
      });
  }

  function handleDelete(newData) {
    axios
      .delete(`http://localhost:8080/endereco/${newData.id}`)
      .then(function (response) {
        console.log('Deletado com sucesso.')
        const dataDelete = [...data];
        const index = newData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
      }).catch((error) => {
        alert('É necessário excluir todos os professores e alunos que usam esse endereço!');
      })
  }

  return (
    [

      <MaterialTable
        title="Gerenciamento de Endereços"
        columns={[
          { title: 'Id', field: 'id', editable: 'never'},
          { title: 'Nº N.F', field: 'numero_nota_fiscal', type: 'numeric'}, 
          { title: 'nome / razao social', field: 'nome_razao_social'},
          { title: 'data de emissao', field: 'data_de_emissao', type: 'date'},
          { title: 'data_de entrada/saida', field: 'data_de_entrada_saida', type: 'date'},
          { title: 'cnpj', field: 'cnpj', type: 'numeric'},
          { title: 'valor nota fiscal', field: 'valor_nota_fiscal', type: 'numeric'}
        ]}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                handleCreate(newData);
                const dataCreate = [...data];
                setData([...dataCreate, newData]);
                resolve();
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                handleUpdate(newData);
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve();
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                  handleDelete(oldData);
                resolve();
              }, 1000)
            }),
        }}
      />]
  )
}

export default GerenciamentoNotasFiscais;
