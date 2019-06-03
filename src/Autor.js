import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizavel from './componentes/SubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';
import './css/modificar.css';

class FormularioAutor extends Component {

    constructor() {

        super();
        this.state = { lista: [], nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.salvaAlteracao = this.salvaAlteracao.bind(this);

    }

    render() {

        return (
            <div className="pure-form pure-form-aligned">
                <div className="header">
                    <h1>Autor</h1>
                </div>
                <form className="pure-form pure-form-aligned header" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')} label="Senha" />                                                   <div className="pure-control-group">
                        <label></label>
                        <SubmitCustomizavel type="submit" nome="Submit" />
                    </div>
                </form>
            </div>
        );

    }

    enviaForm(evento) {

        evento.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/autor',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (novaListagem) {
                console.log(' ');
                PubSub.publish('atualiza-lista-listaAutores', novaListagem);
                this.setState({ nome: '', email: '', senha: '' });
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400)
                    new TratadorErros().publicaErros(resposta.responseJSON);
            },
            beforeSend: function () {
                PubSub.publish('limpa-erros', {});
            }

        });

    }

    salvaAlteracao(nomeInput, evento) {
        var campoSendoAlterado = [];
        campoSendoAlterado[nomeInput] = evento.target.value;
        this.setState(campoSendoAlterado);
    }

    /* setNome(evento) {
         this.setState({nome:evento.target.value});
     }
     
     setEmail(evento) {
         this.setState({email:evento.target.value});
     }
     
     setSenha(evento) {
         this.setState({senha:evento.target.value});
     }*/

}

class TabelaAutores extends Component {

    render() {

        return (
            <div >
                <table className="pure-table table-modificada-autor">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((autor) => (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            )
                            )
                        }
                    </tbody>
                </table>
            </div>
        );

    }

}

export default class AutorBox extends Component {

    constructor() {

        super();
        this.state = { lista: [] };

    }

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:3000/autor',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)

        });

        PubSub.subscribe('atualiza-lista-listaAutores', function (topico, novaLista) {
            this.state.lista.push(novaLista);
            this.setState({ lista: this.state.lista });
        }.bind(this));

    }

    render() {

        return (
            <div>
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista} />
            </div>

        );

    }

} 