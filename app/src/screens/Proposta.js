import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import { gerarHTML } from '../components/propostas/escopo';
import DateTimePicker from '@react-native-community/datetimepicker';


import TextComponente from '../components/TextComp';
import OpcaoSelecao from '../components/OpcaoSelecao'

const TelaPDF = () => {
    const [cliente, setCliente] = useState("");
    const [ac, setAc] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [dataProposta, setDataProposta] = useState(new Date());
    const [frete, setFrete] = useState("");
    const [dataEscolhida, setDataEscolhida] = useState("Escolha a Data da Proposta");
    const [dadosInputs, setDadosInputs] = useState([]);
    const [quantidade, setQuantidade] = useState('');
    const [descricao, setDescricao] = useState('');


    //criação das tabelas
    /*  
    VALOR UNITÁRIO = VALOR POR METRO
    QUANTIDADE = METRAGEM
    TOTAL = VALOR POR METRO * QUANTIDADE
    */


    const adicionarLinhaTabela = (qtd, descricao) => {
        const novaLinha = {
            item: dadosTabela.length + 1,
            qtd,
            descricao,
            valorUnitario: 0,
            valorTotal: 0,
        };

        setDadosTabela([...dadosTabela, novaLinha]);
    };

    const adicionarItem = () => {
        const novoItem = {
            qtd: quantidade,
            descricao: descricao,
        };

        const novosDadosInputs = [...dadosInputs, novoItem];
        setDadosInputs(novosDadosInputs);

        // Limpar os estados após adicionar o item
        setQuantidade('');
        setDescricao('');
    };





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
        const html = gerarHTML(cliente, ac, telefone, endereco, cnpj, dataEscolhida, frete, dadosInputs);

        const options = {
            html,
            fileName: 'Proposta',
        };

        // Gerar o PDF e obter o caminho do arquivo
        const pdf = await Print.printToFileAsync(options);

        // Exibir o PDF
        await Print.printAsync({ uri: pdf.uri, base64: false, });
    };

    const gerarPDF = async () => {
        // Use a função gerarHTML do arquivo escopo.js para gerar o HTML com os dados
        const html = gerarHTML(cliente, ac, telefone, endereco, cnpj, dataEscolhida, frete, dadosInputs);

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
        <ScrollView>
            <View style={styles.container}>
                <TextComponente style={'titulo'}>Informações do Cliente</TextComponente>

                <View style={styles.containerClient}>
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
                    <TextInput
                        placeholder="Telefone"
                        value={telefone}
                        onChangeText={(text) => setTelefone(text)}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Endereço"
                        value={endereco}
                        onChangeText={(text) => setEndereco(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="CNPJ"
                        value={cnpj}
                        onChangeText={(text) => setCnpj(text)}
                        style={styles.input}
                        keyboardType="numbers-and-punctuation"
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

                    <TextComponente style={'numeros'}>Frete Incluso?</TextComponente>

                    <View style={styles.opcoes}>
                        <OpcaoSelecao
                            value="incluso"
                            selectedValue={frete}
                            onValueChange={(value) => setFrete(value)}
                        />

                        <OpcaoSelecao
                            value="não incluso"
                            selectedValue={frete}
                            onValueChange={(value) => setFrete(value)}
                        />
                    </View>

                    {dadosInputs.map((item, index) => (
                        <View key={index}>
                            <TextInput
                                placeholder={`Quantidade - Item ${index + 1}`}
                                value={item.qtd}
                                onChangeText={(text) => {
                                    const novosDadosInputs = [...dadosInputs];
                                    novosDadosInputs[index].qtd = text;
                                    setDadosInputs(novosDadosInputs);
                                }}
                                style={styles.input}
                                keyboardType="numeric"
                            />
                            <TextInput
                                placeholder={`Descrição - Item ${index + 1}`}
                                value={item.descricao}
                                onChangeText={(text) => {
                                    const novosDadosInputs = [...dadosInputs];
                                    novosDadosInputs[index].descricao = text;
                                    setDadosInputs(novosDadosInputs);
                                }}
                                style={styles.input}
                                keyboardType="default"
                            />
                            {/* Outros campos necessários */}
                        </View>
                    ))}


                    <TouchableOpacity onPress={adicionarItem} style={styles.botao}>
                        <Text>Adicionar Item</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.botao}
                        onPress={gerarPDF}
                    >
                        <Text style={styles.textoBotao}>Gerar PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={visualizarPDF}
                    >
                        <Text style={styles.textoBotao}>visualizar PDF</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    containerClient: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    opcoes: {
        width: '90%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    botao: {
        backgroundColor: '#138600',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '65%',
        textAlign: "center",
        alignContent: 'center',
        marginVertical: 50,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: RFPercentage(3),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
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
        marginTop: 5
    },
    dataEscolhida: {
        color: '#00069D',
        width: '100%',
        height: '100%',
        borderRadius: 5,
        fontSize: RFPercentage(2.5),
        fontWeight: 'bold',
        marginTop: 5// ou a cor desejada para a data escolhida
        // Outros estilos, se necessário
    },

});

export default TelaPDF;