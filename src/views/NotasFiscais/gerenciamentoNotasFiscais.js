import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";
import { Delete, Edit } from "@material-ui/icons";

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
        console.log(response.data)
        const notas_fiscais = response.data.map(c => {
          return {
            id: c.id,
            numeroNotaFiscal: c.numeroNotaFiscal,
            nomeRazaoSocial: c.nomeRazaoSocial,
            dataDeEmissao: c.dataDeEmissao,
            dataDeEntradaSaida: c.dataDeEntradaSaida,
            valorNotaFiscal: c.valorNotaFiscal,
            cnpj: c.cnpj,
            descricaoProdutoServico: c.descricaoProdutoServico
          };
        });
        setData(notas_fiscais);
      })
      .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("http://localhost:8080/nota_fiscal", {
        "numeroNotaFiscal": newData.numeroNotaFiscal,
        "nomeRazaoSocial": newData.nomeRazaoSocial,
        "dataDeEmissao": newData.dataDeEmissao,
        "dataDeEntradaSaida": newData.dataDeEntradaSaida,
        "valorNotaFiscal": newData.valorNotaFiscal,
        "descricaoProdutoServico": newData.descricaoProdutoServico,
        "cnpj": newData.cnpj
      })
      .then(function (response) {
        console.log('Salvo com sucesso.')
      });
  }

  function handleUpdate(newData) {
    axios
      .put("http://localhost:8080/nota_fiscal", {
        "id": newData.id,
        "numeroNotaFiscal": newData.numeroNotaFiscal,
        "nomeRazaoSocial": newData.nomeRazaoSocial,
        "dataDeEmissao": newData.dataDeEmissao,
        "dataDeEntradaSaida": newData.dataDeEntradaSaida,
        "valorNotaFiscal": newData.valorNotaFiscal,
        "descricaoProdutoServico": newData.descricaoProdutoServico,
        "cnpj": newData.cnpj
      })
      .then(function (response) {
        console.log('Atualizado com sucesso.')
      });
  }

  function handleDelete(newData) {
    axios
      .delete(`http://localhost:8080/nota_fiscal/${newData.id}`)
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
        title="Gerenciamento de Notas Fiscais"
        columns={[
          { title: 'Nº N.F', field: 'numeroNotaFiscal', type: 'numeric'}, 
          { title: 'nome / razao social', field: 'nomeRazaoSocial'},
          { title: 'data de emissao', field: 'dataDeEmissao', type: 'date'},
          { title: 'data_de entrada/saida', field: 'dataDeEntradaSaida', type: 'date'},
          { title: 'cnpj', field: 'cnpj', type: 'numeric'},
          { title: 'valor nota fiscal', field: 'valorNotaFiscal', type: 'numeric'}
        ]}
        data={data}
        detailPanel={[
          {
            tooltip: 'Show Name',
            render: rowData => {
              return (
                <MaterialTable
                title={`Decrição da nota fiscal ${rowData.numeroNotaFiscal}`}
                columns={[
                  { title: 'Actions', field: '', render: (row) => (
                    <>
                    <a href={"/teste"} target="_blank"><Edit/></a>
                    </>
                  )},
                  { title: 'Código', field: 'codigo'},
                  { title: 'Descrição produto / serviço', field: 'descricaoProdutoServico'}, 
                  { title: 'Valor Unitário', field: 'valorUnitario'},
                  { title: 'Desconto', field: 'desconto'},
                ]}
                data={JSON.parse(rowData.descricaoProdutoServico)}
                />
              )
            },
          },
        ]}
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
