import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import './css/modificar.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros'
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizavel from './componentes/SubmitCustomizado';

class Livro extends Component {

    constructor() {
        super();
        this.state = ({ lista: [], titulo: '', preco: '', autorId: '' });
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <div className="header">
                    <h1>Livro</h1>
                </div>
                <form className="pure-form pure-form-aligned header pure-control-group" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço" />
                    <label>Autor</label>
                    <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
                        <option>{this.props.autores.nome}</option>
                        {
                            this.props.autores.map((autor) =>
                                <option key={autor.id} value={autor.id}>
                                    {autor.nome}
                                </option>
                            )
                        }
                    </select>
                    <label></label>
                    <SubmitCustomizavel type="submit" nome="Submit" />
                </form>
            </div>
        );

    }

    enviaForm(evento) {

        evento.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/livro',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (novaListagem) {
                console.log("enviado com sucesso");
                PubSub.publish('atualiza-lista-livros', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' });
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

    setTitulo(evento) {
        this.setState({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setState({ preco: evento.target.value });
    }

    setAutorId(evento) {
        this.setState({ autorId: evento.target.value });
    }


}

class TabelaLivros extends Component {

    linhaTabela(livro) {
        if (livro.preco >= 300) {
            return (
                <tr key={livro.AutorId} className="tabela-modificada">
                    <td>{livro.titulo}</td>
                    <td>{livro.preco}</td>
                </tr>
            );
        } else {
            return (
                <tr key={livro.AutorId}>
                    <td>{livro.titulo}</td>
                    <td>{livro.preco}</td>
                </tr>
            );
        }
    }

    render() {

        return (
            <div>
                <table className="pure-table table-modificada-livro">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((livro) => (
                                this.linhaTabela(livro)
                            )
                            )
                        }
                    </tbody>
                </table>
            </div>
        );

    }

}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = ({ lista: [], autores: [] });
    }

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:3000/livro',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        $.ajax({
            url: 'http://localhost:3000/autor',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ autores: resposta });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros', function (topico, novaLista) {
            this.state.lista.push(novaLista);
            this.setState({ lista: this.state.lista });
        }.bind(this));

    }


    render() {
        return (
            <div>
                <Livro autores={this.state.autores}></Livro>
                <TabelaLivros lista={this.state.lista}></TabelaLivros>
            </div>
        );

    }

}