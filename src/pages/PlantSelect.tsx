import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header'
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import { PlantProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';



interface EnvironmentProps {
  key: string
  title: string
}

export function PlantSelect() {

  // Armazenando os ambientes
  const [environment, setEnvironments] = useState<EnvironmentProps[]>([])

  // Armazenando os ambientes imagens de plantas
  const [plants, setPlants] = useState<PlantProps[]>([])

  // Armazenando os ambientes filtros
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([])

  // Armazenando os ambientes, qual botão estará ativo
  const [enviromentSelect, setEnviromentSelected] = useState('all');

  // Armazenando os ambientes, carregamento animação
  const [loading, setLoading] = useState(true);

  // Armazenando os ambientes paginação
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false)

  // Navegação entre as paginas.
  const navigation = useNavigation()

  function handleEnviromentSelected(enviroment: string) {
    setEnviromentSelected(enviroment);

    if (enviroment == 'all')
      return setFilteredPlants(plants)

    // Caso o usuário não clicar em todos os campos 
    const filtered = plants.filter(plant =>
      plant.environments.includes(enviroment))

    setFilteredPlants(filtered)
  }

  // Utilizando API com imagens 
  async function fetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`) // Colocando os dados em ordem alfabetica {?_sort=name&_order=asc} // Colocando a paginação com limitação de 8 paginas.

    if (!data)
      return setLoading(true);

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false)
    setLoadingMore(false)
  }

  function handleFetchMore(distance: number) {
    if (distance < 1)
      return

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  // Navegação entre as paginas.
  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }


  // Utilizando API com dados Topo
  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc')// Colocando os dados em ordem alfabetica {?_sort=title&_order=asc}
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',

        },
        ...data
      ])
    }
    fetchEnvironment()
  }, [])


  // Utilizando API com imagens 
  useEffect(() => {
    fetchPlants();
  }, [])

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          data={environment}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key === enviromentSelect}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },

})