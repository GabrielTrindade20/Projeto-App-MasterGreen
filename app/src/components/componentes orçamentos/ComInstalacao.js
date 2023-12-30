import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ComInstalacao = ({ dadosEscolhidos, setDadosEscolha, onSomaChange }) => {

    const {
        deslocamento,
        alimentacao,
        valorEntrega,
        qtdColas
    } = dadosEscolhidos || {};
    // Sua lógica para calcular a soma
    useEffect(() => {
        // Calcula a soma das variáveis
        const somaCalculada = deslocamento + alimentacao + valorEntrega + qtdColas;
        // Passa o resultado para a função onSomaChange
        onSomaChange(somaCalculada);
    }, [deslocamento, alimentacao, valorEntrega, qtdColas]);

    const handleChange = (key, value) => {
        const parsedValue = parseFloat(value);
        setDadosEscolha({ ...dadosEscolhidos, [key]: isNaN(parsedValue) ? '' : parsedValue });
    };



    return (
        <View style={styles.container}>
            <View style={styles.containerOpcao}>
                <View style={styles.containerCont}>
                    <Text style={styles.textInfo}>Deslocamento</Text>
                    <TextInput
                        style={styles.input}
                        value={String(deslocamento)}
                        onChangeText={(number) => handleChange('deslocamento', number)}
                        placeholder="ex: 10,00"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.containerCont}>
                    <Text style={styles.textInfo}>Alimentação</Text>
                    <TextInput
                        style={styles.input}
                        value={String(alimentacao)}
                        onChangeText={(number) => handleChange('alimentacao', number)}
                        placeholder="ex: 10,00"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.containerOpcao}>
                <View style={styles.containerCont}>
                    <Text style={styles.textInfo}>Valor da Entrega</Text>
                    <TextInput
                        style={styles.input}
                        value={String(valorEntrega)}
                        onChangeText={(number) => handleChange('valorEntrega', number)}
                        placeholder="ex: 10,00"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.containerCont}>
                    <Text style={styles.textInfo}>Qtd. Colas</Text>
                    <TextInput
                        style={styles.input}
                        value={String(qtdColas)}
                        onChangeText={(number) => handleChange('qtdColas', number)}
                        placeholder="ex: 10,00"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: "#fff"
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 10,
        padding: 15,
    },
    containerCont: {
        flex: 1,
        marginRight: 10,
    },
    textInfo: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default ComInstalacao;

