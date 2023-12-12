import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoEnderecos = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([
  ]);

  useEffect(() => {
    handleClick();
  }, []);

  function handleClick() {
    axios
      .get("http://localhost:8080/endereco")
      .then(response => {
        const projetos = response.data.map(c => {
          return {
            id: c.id,
            rua: c.rua,
            numero: c.numero,
            cep: c.cep,
            cidade: c.cidade,
            estado: c.estado,
            pais: c.pais
          };
        });
        setData(projetos);
      })
      .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("http://localhost:8080/endereco", {
        "rua": newData.rua,
        "numero": newData.numero,
        "cep": newData.cep,
        "cidade": newData.cidade,
        "estado": newData.estado,
        "pais": newData.pais
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
          { title: 'Rua', field: 'rua' },
          { title: 'Numero', field: 'numero' },
          { title: 'CEP', field: 'cep' },
          { title: 'Cidade', field: 'cidade' },
          { title: 'Estado', field: 'estado' },
          { title: 'Pais', field: 'pais' }
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

export default GerenciamentoEnderecos;
