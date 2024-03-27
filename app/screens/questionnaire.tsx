import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BeefIcon,
  CheckIcon,
  HamIcon,
  MilkOffIcon,
  SaladIcon,
  VeganIcon,
  WheatOffIcon,
} from "lucide-react-native";
import FishIcon from "@/components/icons/FishIcon";
import PeanutIcon from "@/components/icons/PeanutIcon";
import SesameIcon from "@/components/icons/SesameIcon";
import ShellfishIcon from "@/components/icons/ShellfishIcon";
import SoyIcon from "@/components/icons/SoyIcon";

import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type SelectedOptions = {
  [key: string]: boolean;
};

type DietaryOption = {
  key: string;
  label: string;
  icon: any;
};

const dietaryOptions: DietaryOption[] = [
  { key: "vegan", label: "Vegan", icon: VeganIcon },
  { key: "dairyFree", label: "Dairy-Free", icon: MilkOffIcon },
  { key: "vegatarian", label: "Vegetarian", icon: SaladIcon },
  { key: "glutenFree", label: "Gluten-Free", icon: WheatOffIcon },
  { key: "noBeef", label: "No Beef", icon: BeefIcon },
  { key: "nut", label: "Nut Allergy", icon: PeanutIcon },
  { key: "noPork", label: "No Pork", icon: HamIcon },
  { key: "noSoy", label: "No Soy", icon: SoyIcon },
  { key: "noFish", label: "No Fish", icon: FishIcon },
  { key: "noSesame", label: "No Sesame", icon: SesameIcon },
  { key: "noShell", label: "No Shellfish", icon: ShellfishIcon },
];

export default function QuestionnaireScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [noneApply, setNoneApply] = useState(false);

  const handleSavePreferences = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser?.uid);

        await updateDoc(userRef, {
          dietaryPreferences: selectedOptions,
        });

        navigation.navigate("Home");
        Alert.alert("Success", "Your dietary preferences have been saved.");
      } catch (error) {
        console.error("Error writing document: ", error);
        Alert.alert("Error", "There was a problem saving your preferences.");
      }
    } else {
      Alert.alert("Error", "You must be logged in to save preferences.");
    }
  };

  const handleToggle = (key: string) => {
    if (noneApply) {
      setNoneApply(false);
    }
    setSelectedOptions((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleNoneApplyToggle = () => {
    setNoneApply(!noneApply);
    setSelectedOptions({});
  };

  const isAnyOptionsSelected =
    noneApply || Object.values(selectedOptions).some((value) => value);

  const renderItem = ({
    item,
    index,
  }: {
    item: DietaryOption;
    index: number;
  }) => {
    const IconComponent = item.icon;
    const isOdd = index % 2 !== 0;
    return (
      <View style={[styles.itemContainer, isOdd ? styles.itemRight : null]}>
        <Pressable
          style={({ pressed }) => [
            styles.optionButton,
            selectedOptions[item.key] ? styles.optionButtonSelected : null,
            pressed ? styles.optionButtonSelected : null,
          ]}
          onPress={() => handleToggle(item.key)}
          disabled={noneApply}
        >
          {IconComponent && (
            <IconComponent color="black" height={24} width={24} />
          )}
          <Text style={styles.optionButtonText}>{item.label}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Do any of the following apply to you?</Text>
        <Text style={styles.subtitle}>
          Don't worry, you can always edit this later.
        </Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={dietaryOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={styles.optionWrapper}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Switch value={noneApply} onValueChange={handleNoneApplyToggle} />
        <Text style={styles.checkboxLabel}>None of these apply</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.continueButton,
          !isAnyOptionsSelected ? styles.buttonDisabled : null,
        ]}
        onPress={handleSavePreferences}
        disabled={!isAnyOptionsSelected}
      >
        <CheckIcon color="black" />
        <Text style={styles.continueButtonText}>Finished</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 40,
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 70,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
    marginTop: 14,
  },
  content: {
    flex: 4,
    marginTop: 25,
  },
  itemContainer: {
    width: "48%",
  },
  itemRight: {
    marginLeft: "5%",
  },
  optionWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#E7FCDA",
    borderRadius: 20,
  },
  optionButtonText: { marginLeft: 10 },
  optionButtonSelected: { backgroundColor: "#9AEF66" },
  checkboxContainer: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkboxLabel: { marginLeft: 10 },
  continueButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9AEF66",
    padding: 10,
    borderRadius: 10,
  },
  continueButtonText: { marginLeft: 5, fontSize: 16 },
  buttonDisabled: {
    backgroundColor: "gainsboro",
    width: "auto",
    padding: 10,
    borderRadius: 10,
  },
});
