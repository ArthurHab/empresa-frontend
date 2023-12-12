import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoProfessores = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([]);
  const [enderecosMapeados, setEnderecosMapeados] = useState({});

  useEffect(() => {
    handleClick();
  }, []);

  async function getEnderecos() {
    axios
      .get("http://localhost:8080/endereco")
      .then(response => {
        const enderecos = response.data.map(c => {
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
      var novoObjeto = {};
      enderecos.forEach(function(objeto) {
        novoObjeto[objeto.id] = `${objeto.id} - ${objeto.rua}`; 
      });
      setEnderecosMapeados(novoObjeto);
      })
      .catch(error => console.log(error));
  }

  async function handleClick() {
    await getEnderecos();
      axios
      .get("http://localhost:8080/professor")
      .then(response => {
        let professores = response.data.map(c => {
          return {
            id: c.id,
            matricula: c.matricula,
            nome: c.nome,
            curso: c.curso,
            idEndereco: c.endereco.id
          };
        });
        setData(professores);
      })
      .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("http://localhost:8080/professor", {
        "matricula": newData.matricula,
        "nome": newData.nome,
        "endereco": newData.idEndereco,
        "curso": newData.curso
      })
      .then(function (response) {
        console.log('Salvo com sucesso.')
      });
  }

  function handleUpdate(newData) {
    axios
      .put("http://localhost:8080/professor", {
        "id": newData.id,
        "matricula": newData.matricula,
        "nome": newData.nome,
        "endereco": newData.idEndereco,
        "curso": newData.curso
      })
      .then(function (response) {
        console.log('Atualizado com sucesso.')
      });
  }

  function handleDelete(newData) {
    axios
      .delete(`http://localhost:8080/professor/${newData.id}`)
      .then(function (response) {
        console.log('Deletado com sucesso.')
      });
  }

  return (
    [

      <MaterialTable
        title="Gerenciamento de Professores"
        columns={[
          { title: 'Id', field: 'id', editable: 'never'},
          { title: 'matricula', field: 'matricula' },
          { title: 'nome', field: 'nome' },
          {
            title: 'ID-Rua',
            field: 'idEndereco',
            lookup: enderecosMapeados,
          },
          { title: 'curso', field: 'curso' }
        ]}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                handleCreate(newData)

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
                handleDelete(oldData)
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);

                resolve()
              }, 1000)
            }),
        }}
      />]
  )
}

export default GerenciamentoProfessores;
