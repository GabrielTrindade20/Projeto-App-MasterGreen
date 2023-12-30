import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";
import Orcamento from "./Orcamento";

const ValorFinal = ({ somaComInstalacao }) => {

    const [lucroEmpresa, setLucroEmpresa] = useState("");
    const [desconto, setDesconto] = useState("");
    const [valorBruto, setValorBruto] = useState(0);
    const [totalValorCliente, setTotalValorCliente] = useState(0);
    const [totalNotaFiscal, setTotalNotaFiscal] = useState(0);
    const [totalLucroEmpresa, setTotalLucroEmpresa] = useState(0);

    useEffect(() => {
        setValorBruto(somaComInstalacao);
    }, [somaComInstalacao]);


    // useEffect(() => {
    //     // Converte o valor para float ou mantém como 0 se vazio
    //     const lucroEmpresaFloat = parseFloat(lucroEmpresa) || 0;

    //     // Atualiza o totalValorCliente apenas se lucroEmpresa tiver um valor
    //     setTotalValorCliente(lucroEmpresaFloat !== 0 ? somaComInstalacao + (lucroEmpresaFloat * somaComInstalacao / 100) : 0);
    //     // Atualiza o totalNotaFiscal apenas se lucroEmpresa tiver um valor
    //     setTotalNotaFiscal(lucroEmpresaFloat !== 0 ? totalValorCliente * 4.5 / 100 : 0);
    //     // Atualiza o totalLucroEmpresa apenas se lucroEmpresa tiver um valor
    //     setTotalLucroEmpresa(lucroEmpresaFloat !== 0 ? lucroEmpresaFloat * somaComInstalacao / 100 : 0);
    // }, [lucroEmpresa, somaComInstalacao]);

    useEffect(() => {
        const lucroEmpresaFloat = parseFloat(lucroEmpresa) || 0;
        const descontoFloat = desconto !== '' ? parseFloat(desconto) : 0;

        const valorComLucroEmpresa = somaComInstalacao + (lucroEmpresaFloat * somaComInstalacao / 100);
        const valorComDesconto = valorComLucroEmpresa - (valorComLucroEmpresa * descontoFloat / 100);

        // Se lucroEmpresa não tiver valor, define totalValorCliente como 0
        setTotalValorCliente(lucroEmpresaFloat !== 0 ? (descontoFloat !== 0 ? valorComDesconto : valorComLucroEmpresa) : 0);

        setTotalNotaFiscal(lucroEmpresaFloat !== 0 ? (descontoFloat !== 0 ? valorComDesconto * 4.5 / 100 : valorComLucroEmpresa * 4.5 / 100) : 0);

        let valorLucroEmpresa = 0;

        if (descontoFloat !== 0) {
            valorLucroEmpresa = somaComInstalacao - Math.abs(valorComDesconto - (valorComDesconto * 4.5 / 100));
        } else {
            valorLucroEmpresa = somaComInstalacao - Math.abs(valorComLucroEmpresa - (valorComLucroEmpresa * 4.5 / 100));
        }

        // Se lucroEmpresa não tiver valor, define totalLucroEmpresa como 0
        setTotalLucroEmpresa(lucroEmpresaFloat !== 0 ? Math.abs(valorLucroEmpresa) : 0);

    }, [lucroEmpresa, desconto, somaComInstalacao]);


    return (
        <View style={styles.container}>
            <View style={styles.opcoes}>
                <TextComponent style={"textInfo"}>Lucro da Empresa %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={(number) => setLucroEmpresa(number)}
                    value={String(lucroEmpresa)}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.opcoes}>
                <TextComponent style={"textInfo"}>Desconto %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={(number) => setDesconto(number)}
                    value={String(desconto)}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.containerValFinal}>
                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR BRUTO DO SERVIÇO</Text>
                    <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                        {parseFloat(valorBruto).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR FINAL DO CLIENTE</Text>
                    <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                        {parseFloat(totalValorCliente).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR DA NOTA FISCAL</Text>
                    <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                        {parseFloat(totalNotaFiscal).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR DO LUCRO DA EMPRESA</Text>
                    <Text style={[{ color: "#1DAC46" }, styles.textValores]}>
                        {parseFloat(totalLucroEmpresa).toFixed(2)}
                    </Text>
                </View>
                {/* Adicione as outras seções conforme necessário */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 15,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    opcoes: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 5,
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold'
    },
    containerValFinal: {
        flexDirection: 'collum',
        alignItems: 'center',
        marginTop: 10,
    },
    textOpcoes: {
        marginVertical: 5,
        alignItems: 'center',
    },
    textInfo: {
        fontSize: 20,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
    },
    textValores: {
        fontSize: 25,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
        // Outros estilos
    },
})

export default ValorFinal;



