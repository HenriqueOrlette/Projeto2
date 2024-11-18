import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../config/supabase";

const Home = ({ navigation }) => {
  const [grupos, setGrupos] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase.from("Grupo").select(`
        id,
        Tema,
        Dia,
        Aluno (
          nome
        ),
        Avaliacao (
          Nota
        )
      `);

      setLoading(false);

      if (error) {
        setFetchError("Erro ao buscar grupos.");
        setGrupos([]);
        console.error("Supabase error:", error.message);
      } else {
        setGrupos(data);
        setFetchError(null);
      }
    };

    fetchGrupos();
  }, []);

  const toggleExpandGroup = (groupId) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter((id) => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : fetchError ? (
        <Text style={styles.error}>{fetchError}</Text>
      ) : (
        <>
          <Text style={styles.groupsTitle}>🎓 Grupos InovaWeek</Text>
          <FlatList
            data={grupos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: getColor(item.id) }]}>
                <TouchableOpacity
                  onPress={() => toggleExpandGroup(item.id)}
                  style={styles.cardHeader}
                >
                  <Text style={styles.title}>{item.Tema}</Text>
                  <Text style={styles.date}>📅 {item.Dia}</Text>
                </TouchableOpacity>
                {expandedGroups.includes(item.id) && (
                  <View style={styles.details}>
                    <Text style={styles.sectionTitle}>🌟 Notas</Text>
                    {item.Avaliacao.length > 0 ? (
                      item.Avaliacao.map((avaliacao, index) => (
                        <Text key={index} style={styles.info}>
                          Nota: {avaliacao.Nota}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.info}>Nenhuma avaliação disponível</Text>
                    )}
                    <Text style={styles.sectionTitle}>👨‍🎓 Alunos</Text>
                    {item.Aluno.length > 0 ? (
                      item.Aluno.map((aluno, index) => (
                        <Text key={index} style={styles.info}>
                          Nome: {aluno.nome}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.info}>Nenhum aluno neste grupo</Text>
                    )}
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

// Função para definir cores diferentes para cada grupo
const getColor = (id) => {
  const colors = ["#FFD700", "#FF6F61", "#6B8E23", "#4A90E2", "#FFB6C1"];
  return colors[id % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEFF2",
    padding: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  card: {
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
  },
  info: {
    fontSize: 14,
    color: "#444",
    marginVertical: 2,
  },
  details: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  error: {
    color: "#FF6F61",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Home;
