/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'
import { faker } from '@faker-js/faker';
let emailfaker = faker.internet.email();


describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('vitortecam@gmail.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: '/usuarios',
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(1289)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`

          cy.request({
               method: 'POST',
               url: '/usuarios',
               body: {
                    "nome": usuario,
                    "email": emailfaker,
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')

          })

     });

     it('Deve validar um usuário com email inválido', () => {

          cy.request({
               method: 'POST',
               url: '/usuarios',
               body: {
                    "nome": "Vitor Souza",
                    "email": "vitortecam@gmail.com",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false,
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')


          })

     });

     it.only('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
          cy.cadastrarUsuario(token, usuario, emailfaker, "teste", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": usuario,
                              "email": emailfaker,
                              "password": "teste",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });



     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
          cy.cadastrarUsuario(token, usuario, emailfaker, "teste", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })

               })
     })

});
