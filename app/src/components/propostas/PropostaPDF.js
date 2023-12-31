import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import { gerarHTML } from './escopoHTML';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';


import Formatacao from './CpfCnpj';
import TextComponente from '../TextComp';
import OpcaoSelecao from '../OpcaoSelecao'
import Telefone from './Telefone'

const TelaPDF = () => {
    const [cliente, setCliente] = useState("");
    const [ac, setAc] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState("");
    const [dataProposta, setDataProposta] = useState(new Date());
    const [frete, setFrete] = useState("");
    const [dataEscolhida, setDataEscolhida] = useState("Escolha a Data da Proposta");
    const [dadosInputs, setDadosInputs] = useState([]);

    const [metragem, setMetragem] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorPorMetro, setValorPorMetro] = useState('');
    const [valorFinalCliente, setValorFinalCliente] = useState('')
    const [desconto, setDesconto] = useState('');



    const adicionarItem = () => {

        const novoItem = {
            qtd: metragem,
            descricao: descricao,
            valorPorMetro: valorPorMetro,
        };

        const novosDadosInputs = [...dadosInputs, novoItem];
        setDadosInputs(novosDadosInputs);

        // Limpar os estados após adicionar o item
        setMetragem('');
        setDescricao('');
        setValorPorMetro('');

    };

    const removerUltimoItem = () => {
        if (dadosInputs.length > 0) {
            const novosDadosInputs = [...dadosInputs];
            novosDadosInputs.pop(); // Remove o último item do array
            setDadosInputs(novosDadosInputs);
        }
    }


    //CONFIGURAÇÃO PARA DATA
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dataProposta;
        setShowDatePicker(Platform.OS === 'ios');
        setDataProposta(currentDate);

        // Se uma data foi escolhida, atualize a variável de estado dataEscolhida
        if (currentDate !== null) {
            const dia = (currentDate.getDate()).toLocaleString().padStart(2, '0');
            const mes = (currentDate.getMonth() + 1).toLocaleString().padStart(2, '0');
            const ano = currentDate.getFullYear();
            setDataEscolhida(`${dia}/${mes}/${ano}`);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    //CONFIGURAÇÃO PARA DATA

    const visualizarPDF = async () => {
        // Atualizar o valorFinalCliente antes de chamar gerarHTML
        let valorFinalClienteCalculado = 0;

        if (parseFloat(desconto) > 0) {
            // Se houver um desconto definido, aplicar o desconto ao valor total
            valorFinalClienteCalculado = dadosInputs.reduce((total, item) => {
                const subtotal = parseFloat(item.valorPorMetro) * parseFloat(item.metragem);
                const descontoDecimal = parseFloat(desconto) || 0;
                const valorDesconto = subtotal * descontoDecimal / 100;
                return total + (subtotal - valorDesconto);
            }, 0);
        } else {
            // Se não houver desconto, simplesmente somar os valores finais
            valorFinalClienteCalculado = dadosInputs.reduce((total, item) => {
                const subtotal = parseFloat(item.valorPorMetro) * parseFloat(item.metragem);
                return total + subtotal;
            }, 0);
        }

        setValorFinalCliente(valorFinalClienteCalculado);

        const html = gerarHTML(cliente, ac, telefone, endereco, tipoPessoa, dataEscolhida, frete, dadosInputs, valorFinalClienteCalculado);

        const options = {
            html,
            fileName: 'Proposta',
        };

        // Gerar o PDF e obter o caminho do arquivo
        const pdf = await Print.printToFileAsync(options);

        // Exibir o PDF
        await Print.printAsync({ uri: pdf.uri, base64: false });
    };


    const gerarPDF = async () => {
        let valorFinalClienteCalculado = 0;

        if (parseFloat(desconto) > 0) {
            // Se houver um desconto definido, aplicar o desconto ao valor total
            valorFinalClienteCalculado = dadosInputs.reduce((total, item) => {
                const subtotal = parseFloat(item.valorPorMetro) * parseFloat(item.metragem);
                const descontoDecimal = parseFloat(desconto) || 0;
                const valorDesconto = subtotal * descontoDecimal / 100;
                return total + (subtotal - valorDesconto);
            }, 0);
        } else {
            // Se não houver desconto, simplesmente somar os valores finais
            valorFinalClienteCalculado = dadosInputs.reduce((total, item) => {
                const subtotal = parseFloat(item.valorPorMetro) * parseFloat(item.metragem);
                return total + subtotal;
            }, 0);
        }

        setValorFinalCliente(valorFinalClienteCalculado);
        // Use a função gerarHTML do arquivo escopo.js para gerar o HTML com os dados
        const html = gerarHTML(cliente, ac, telefone, endereco, tipoPessoa, dataEscolhida, frete, dadosInputs, valorFinalClienteCalculado);

        const options = {
            html,
            fileName: 'proposta',
            directory: 'Documents',
        };

        // Imprimir o PDF e obter o caminho do arquivo
        const pdf = await Print.printToFileAsync(options);

        // Agora você pode usar o caminho do arquivo para compartilhar ou fazer outras ações
        // Exemplo de compartilhamento:
        await shareAsync(pdf.uri);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containnerSections}>
                <TextComponente style={'titulo'}>Informações do Cliente</TextComponente>
                <TextInput
                    placeholder="Cliente"
                    value={cliente}
                    onChangeText={(text) => setCliente(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="A/C"
                    value={ac}
                    onChangeText={(text) => setAc(text)}
                    style={styles.input}
                />
                <Telefone
                    placeholder="Telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                />

                <TextInput
                    placeholder="Endereço"
                    value={endereco}
                    onChangeText={(text) => setEndereco(text)}
                    style={[styles.inputItens, styles.inputMultiline]} // Adiciona o estilo inputMultiline
                    keyboardType="default"
                    multiline={true} // Habilita a digitação de várias linhas
                    numberOfLines={5}
                />
                <Formatacao
                    placeholder="CNPJ ou CPF"
                    value={tipoPessoa}
                    onChangeText={(text) => setTipoPessoa(text)}
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={styles.input}
                    onPress={showDatepicker}
                >
                    <View />
                    {showDatePicker && (
                        <DateTimePicker
                            display="calendar"
                            value={dataProposta}
                            mode="date"
                            is24Hour={true}
                            onChange={onChange}
                            locale="pt-BR"
                            timeZoneName={'America/Sao_Paulo'}
                            toLocaleString="pt-BR"
                            dateFormat="day dayofweek month"
                        />
                    )}

                    {/* Renderização condicional da data */}
                    <Text style={dataProposta !== null ? [styles.dataEscolhida, styles.containerData] : [styles.textPadrao, styles.containerData]}>
                        {dataProposta !== null ? dataEscolhida : "Escolha a Data da Proposta"}
                    </Text>

                </TouchableOpacity>
            </View>

            <View style={styles.containnerSections}>
                <TextComponente style={'numeros'}>Frete Incluso?</TextComponente>

                <View style={styles.opcoes}>
                    <OpcaoSelecao
                        value=" Incluso"
                        selectedValue={frete}
                        onValueChange={(value) => setFrete(value)}
                    />

                    <OpcaoSelecao
                        value=" Não Incluso"
                        selectedValue={frete}
                        onValueChange={(value) => setFrete(value)}
                    />
                </View>
            </View>


            {dadosInputs.map((item, index) => (
                <View key={index} style={styles.containnerSections} >

                    <View style={styles.containerItensAdd}>
                        <TextComponente style={"textInfo"}>METRAGEM (m²)</TextComponente>
                        <TextInput
                            placeholder="Ex: 10"
                            value={item.metragem}
                            onChangeText={(text) => {
                                const novosDadosInputs = [...dadosInputs];
                                novosDadosInputs[index].metragem = text;
                                setDadosInputs(novosDadosInputs);
                            }}
                            style={styles.inputItens}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.containerItensAdd}>
                        <TextComponente style={"textInfo"}>VALOR POR METRO</TextComponente>
                        <TextInput
                            placeholder="Ex: 80"
                            value={item.valorPorMetro}
                            onChangeText={(text) => {
                                const novosDadosInputs = [...dadosInputs];
                                novosDadosInputs[index].valorPorMetro = text;
                                setDadosInputs(novosDadosInputs);
                            }}
                            style={styles.inputItens}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.containerItensAdd}>
                        <TextComponente style={"textInfo"}>DESCRIÇÃO DO PRODUTO</TextComponente>
                        <TextInput
                            placeholder="Ex: grama sintética"
                            value={item.descricao}
                            onChangeText={(text) => {
                                const novosDadosInputs = [...dadosInputs];
                                novosDadosInputs[index].descricao = text;
                                setDadosInputs(novosDadosInputs);
                            }}
                            style={[styles.inputItens, styles.inputMultiline]} // Adiciona o estilo inputMultiline
                            keyboardType="default"
                            multiline={true} // Habilita a digitação de várias linhas
                            numberOfLines={5} // Define o número inicial de linhas (ajuste conforme necessário)

                        />
                    </View>
                    {/* Outros campos necessários */}
                </View>
            ))}

            <View style={styles.containerItem}>
                <TouchableOpacity onPress={adicionarItem} style={styles.botaoItem}>
                    <TextComponente style='botao2'>Adicionar Item</TextComponente>
                </TouchableOpacity>

                <TouchableOpacity onPress={removerUltimoItem} style={styles.botaoItem}>
                    <TextComponente style='botao2'>Remover Item</TextComponente>
                </TouchableOpacity>
            </View>

            <View style={styles.containnerSections}>
                <TextComponente style={"textInfo"}>VALOR DO DESCONTO</TextComponente>
                <TextInput
                    placeholder="Desconto"
                    value={desconto}
                    onChangeText={(text) => setDesconto(text)}
                    style={styles.inputItens}
                    keyboardType="numeric"
                />
            </View>


            <View style={{ width: "50%", marginBottom: 20 }}>
                <TouchableOpacity
                    style={styles.botao}
                    onPress={gerarPDF}
                >
                    <TextComponente style={"botao"}>Gerar PDF</TextComponente>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={visualizarPDF}
                >
                    <TextComponente style={'botao'}>Visualizar PDF</TextComponente>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    containnerSections: {
        alignItems: 'center',
        width: '90%',
        marginVertical: 20,
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 20,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    containerItem: {
        flexDirection: 'row',
        width: "90%",
        textAlign: "center",
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    containerItensAdd: {
        width: "100%",
        alignItems: "center",
        textAlign: 'center',
        marginVertical: 5,
    },
    itens: {
        alignItems: "center",
        width: "80%",
    },
    inputItens: {
        height: 40,
        borderWidth: 2,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
        width: "100%",
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
        paddingHorizontal: 10,
    },
    opcoes: {
        width: '90%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
        marginBottom: 20,
    },
    inputMultiline: {
        textAlignVertical: 'top', // Alinha o texto no topo da caixa de texto
        height: 80, // Altura inicial (ajuste conforme necessário)
        paddingTop: 5,
        paddingHorizontal: 10,
    },
    botao: {
        backgroundColor: '#B81100',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        textAlign: "center",
        alignContent: 'center',
    },
    botaoItem: {
        backgroundColor: '#138600',
        padding: 15,
        width: 'auto',
        borderRadius: 10,
    },

    tabelaContainer: {
        width: '100%',
        marginTop: 20,
        borderWidth: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
    tabelaCabecalho: {
        flexDirection: 'row',
        backgroundColor: '#138600',
        paddingVertical: 10,
    },
    tabelaCabecalhoTexto: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: RFPercentage(2),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tabelaItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#138600',
        paddingVertical: 10,
    },
    tabelaItemTexto: {
        flex: 1,
        fontSize: RFPercentage(2),
        textAlign: 'center',
    },
    containerData: {
        alignItems: 'center',
        textAlign: 'center',
        alignContent: 'center',
    },
    estiloData: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        fontSize: RFPercentage(2.5),
        fontWeight: 'bold',
        marginTop: 5,
    },
    dataEscolhida: {
        color: '#00069D',
        width: '100%',
        height: '100%',
        borderRadius: 5,
        fontSize: RFPercentage(2.5),
        fontWeight: 'bold',
        marginTop: 5,
    },
});


export default TelaPDF;