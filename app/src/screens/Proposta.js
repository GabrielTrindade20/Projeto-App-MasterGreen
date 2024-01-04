import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, TextComponent } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import { gerarHTML } from '../components/propostas/escopo';
import DateTimePicker from '@react-native-community/datetimepicker';

import TextComponente from '../components/TextComp'

const TelaPDF = () => {
    const [cliente, setCliente] = useState("");
    const [ac, setAc] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [dataProposta, setDataProposta] = useState(new Date());
    const [frete, setFrete] = useState("");

    //CONFIGURAÇÃO PARA DATA
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // Fechar o seletor no iOS
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };
    //CONFIGURAÇÃO PARA DATA

    const visualizarPDF = async () => {
        const html = gerarHTML(cliente, ac, telefone, endereco, cnpj, dataProposta);

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
        const html = gerarHTML(cliente, ac, telefone, endereco, cnpj, dataProposta);

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
            <TextComponente style={'titulo'}>tela do pdf</TextComponente>

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

                <View>
                    <Button onPress={showDatepicker} title="Selecione a Data" />
                    {showDatePicker && (
                        <DateTimePicker
                            display="calendar"
                            value={dataProposta}
                            mode="date"
                            is24Hour={true}                            
                            onChange={onChange}
                            timeZoneName="America/Fortaleza"
                            locale="pt-BR"
                            toLocaleString="pt-BR"
                            dateFormat="dayofweek day month"
                        />
                    )}
                    <Text>Data selecionada: {dataProposta.toDateString('pt-BR')}</Text>
                </View>

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerClient: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
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
    },
});

export default TelaPDF;