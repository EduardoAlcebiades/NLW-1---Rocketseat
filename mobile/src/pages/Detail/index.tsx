import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { TouchableOpacity, RectButton } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import api from "../../services/api";
import * as MailComposer from "expo-mail-composer";

interface Params {
  point_id: number;
}

interface PointItem {
  point: {
    id: number;
    image: string;
    name: string;
    whatsapp: string;
    email: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const [pointItem, setPointItem] = useState<PointItem>({} as PointItem);

  useEffect(() => {
    const { point_id } = route.params as Params;

    api.get<PointItem>(`points/${point_id}`).then((response) => {
      setPointItem(response.data);
    });
  }, []);

  function handleGoBack() {
    navigation.goBack();
  }

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${pointItem.point.whatsapp}&text=Tenho interesse na coleta de resíduos`
    );
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos",
      recipients: [pointItem.point.email],
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        {pointItem.point && (
          <>
            <Image
              style={styles.pointImage}
              source={{ uri: pointItem.point.image }}
            />

            <Text style={styles.pointName}>{pointItem.point.name}</Text>

            <Text style={styles.pointItems}>
              {pointItem.items.map((item) => `${item.title}, `)}
            </Text>

            <View style={styles.address}>
              <Text style={styles.addressTitle}>Endereço</Text>
              <Text style={styles.addressContent}>
                {pointItem.point.city}, {pointItem.point.uf}
              </Text>
            </View>
          </>
        )}
      </View>

      {pointItem.point && (
        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsapp}>
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icon name="mail" size={20} color="#fff" />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#322153",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});
