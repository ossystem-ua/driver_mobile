import { useTheme } from '@/Theme'
import { MetricsSizes } from '@/Theme/Variables'
import React from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import FilterSlider from './FilterSlider'

const filterTypes = {
  DEFAULT_IMAGE: 0,
  GRAYSCALE: 1,
  BRIGHTNESS: 2,
  CONTRAST: 3,
  FILTERED_IMAGE: 4,
}

const FilterImageControls = ({
  currentFilter,
  setCurrentFilter,
  filterProps,
  savingInProgress,
  applyFilter,
  saveImage,
}) => {
  const { Layout, Gutters, Colors } = useTheme()
  return (
    <View style={Layout.fullWidth}>
      {currentFilter !== filterTypes.DEFAULT_IMAGE && (
        <View
          style={{
            ...Layout.justifyContentCenter,
            ...Gutters.scale200TMargin,
            ...Layout.row,
            backgroundColor: Colors.backgroundMainColor,
          }}
        >
          {currentFilter !== filterTypes.GRAYSCALE && (
            <FilterSlider {...filterProps} />
          )}
          <Pressable
            style={{
              height: 50,
              width: 30,
              ...Layout.selfCenter,
              ...Layout.justifyContentCenter,
              ...Gutters.scale200LMargin,
              opacity: savingInProgress ? 0.5 : 1,
            }}
            onPress={applyFilter}
            disabled={savingInProgress}
          >
            <Icon
              name="ios-checkmark"
              style={[
                {
                  fontSize: Number(MetricsSizes.scale280),
                  color: Colors.primary,
                  textAlign: 'center',
                },
              ]}
            />
          </Pressable>
        </View>
      )}
      <View style={[Layout.justifyContentCenter, Layout.row]}>
        <Pressable
          style={{
            backgroundColor:
              currentFilter === filterTypes.GRAYSCALE
                ? Colors.white
                : Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200VMargin,
          }}
          onPress={() => setCurrentFilter(filterTypes.GRAYSCALE)}
          disabled={savingInProgress}
        >
          <Icon
            name="ios-color-filter-sharp"
            style={[
              {
                fontSize: Number(MetricsSizes.scale280),
                color:
                  currentFilter === filterTypes.GRAYSCALE
                    ? Colors.primary
                    : Colors.white,
                textAlign: 'center',
              },
            ]}
          />
        </Pressable>
        <Pressable
          style={{
            backgroundColor:
              currentFilter === filterTypes.BRIGHTNESS
                ? Colors.white
                : Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200VMargin,
          }}
          onPress={() => setCurrentFilter(filterTypes.BRIGHTNESS)}
          disabled={savingInProgress}
        >
          <Icon
            name="sunny-outline"
            style={[
              {
                fontSize: Number(MetricsSizes.scale280),
                color:
                  currentFilter === filterTypes.BRIGHTNESS
                    ? Colors.primary
                    : Colors.white,
                textAlign: 'center',
              },
            ]}
          />
        </Pressable>
        <Pressable
          style={{
            backgroundColor:
              currentFilter === filterTypes.CONTRAST
                ? Colors.white
                : Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200VMargin,
          }}
          onPress={() => setCurrentFilter(filterTypes.CONTRAST)}
          disabled={savingInProgress}
        >
          <Icon
            name="contrast"
            style={[
              {
                fontSize: Number(MetricsSizes.scale280),
                color:
                  currentFilter === filterTypes.CONTRAST
                    ? Colors.primary
                    : Colors.white,
                textAlign: 'center',
              },
            ]}
          />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200VMargin,
          }}
          onPress={saveImage}
          disabled={savingInProgress}
        >
          <Icon
            name="ios-arrow-forward-sharp"
            style={[
              {
                fontSize: Number(MetricsSizes.scale280),
                color: Colors.white,
                textAlign: 'center',
              },
            ]}
          />
        </Pressable>
      </View>
    </View>
  )
}

export default FilterImageControls
