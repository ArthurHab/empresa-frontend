import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoProjetos = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([]);
  const [alunosMapeados, setAlunosMapeados] = useState({});
  const [professoresMapeados, setProfessoresMapeados] = useState({});

  useEffect(() => {
    handleClick();
  }, []);
  
  async function getProfessores(){
    const professores = axios
      .get("http://localhost:8080/professor")
      .then((response) => {
        var novoObjeto = {};
        response.data.forEach(function(objeto) {
          novoObjeto[objeto.id] = `${objeto.id} - ${objeto.nome}`; 
        });
        setProfessoresMapeados(novoObjeto);
        return(response.data);
      })
      return professores;
  }

  async function getAlunos(){
    const alunos = axios
      .get("http://localhost:8080/aluno")
      .then((response) => {
        var novoObjeto = {};
        response.data.forEach(function(objeto) {
          novoObjeto[objeto.id] = `${objeto.id} - ${objeto.nome}`; 
        });
        setAlunosMapeados(novoObjeto);
        return(response.data);
    })
    return alunos;
  }

  async function handleClick() {
    let alunos = await getAlunos();
    let professores = await getProfessores();
    axios
    .get("http://localhost:8080/projeto")
    .then(response => {
      let projetos = response.data.map(c => {

        let aluno = 'não cadastrado';
        let professor = 'não cadastrado';
        let alunoFiltrado = alunos.filter((aluno) => aluno.id === c.idAluno);
        let professorFiltrado = professores.filter((professor) => professor.id === c.idProfessor);

        if(alunoFiltrado.length > 0){
          aluno = alunoFiltrado[0].id
        }
        if(professorFiltrado.length > 0){
          professor = professorFiltrado[0].id
        }
        
        return {
          id: c.id,
          tituloProjeto: c.tituloProjeto,
          areaProjeto: c.areaProjeto,
          resumo: c.resumo,
          url: c.url,
          idProfessor: professor,
          idAluno: aluno,
        };
      });
      setData(projetos);
    })
    .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("http://localhost:8080/projeto", {
        "tituloProjeto": newData.tituloProjeto,
        "areaProjeto": newData.areaProjeto,
        "resumo": newData.resumo,
        "idProfessor": newData.idProfessor,
        "idAluno": newData.idAluno,
        "url": newData.url
      })
      .then(function (response) {
        console.log('Salvo com sucesso.')
      });
  }

  function handleUpdate(newData) {
    axios
      .put("http://localhost:8080/projeto", {
        "id": newData.id,
        "tituloProjeto": newData.tituloProjeto,
        "areaProjeto": newData.areaProjeto,
        "resumo": newData.resumo,
        "idProfessor": newData.idProfessor,
        "idAluno": newData.idAluno,
        "url": newData.url
      })
      .then(function (response) {
        console.log('Atualizado com sucesso.')
      });
  }

  function handleDelete(newData) {
    axios
      .delete(`http://localhost:8080/projeto/${newData.id}`)
      .then(function (response) {
        console.log('Deletado com sucesso.')
      });
  }

  return (
    [
      <MaterialTable
        title="Gerenciamento de Projetos"
        columns={[
          { title: 'Id', field: 'id', editable: 'never'},
          { title: 'Titulo Projeto', field: 'tituloProjeto' },
          { title: 'Area Projeto', field: 'areaProjeto'},
          { title: 'Resumo', field: 'resumo' },
          { title: 'ID - Professor responsável ', field: 'idProfessor', lookup: professoresMapeados},
          { title: 'ID - Aluno participante', field: 'idAluno', lookup: alunosMapeados},
          { title: 'URL', field: 'url' },
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

export default GerenciamentoProjetos;
