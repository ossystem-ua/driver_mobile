import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  View,
  Text,
  Platform,
  ActivityIndicator,
  LayoutChangeEvent,
  Appearance,
  Image,
  Pressable,
} from 'react-native'
import Pdf from 'react-native-pdf'
import { PDFDocument } from 'pdf-lib'
import Signature from 'react-native-signature-canvas'
import { decode as atob, encode as btoa } from 'base-64'
import RNFetchBlob from 'rn-fetch-blob'
import { isIOS } from '@/Services/Helpers'
import { useTheme } from '@/Theme'
import { useSelector } from 'react-redux'
import { selectDarkMode, selectTheme } from '@/Store/Theme'
import Draggable from 'react-native-draggable'
import FilterSlider from './FilterImageControls/FilterSlider'
import { BaseButton } from '@/Components'

const REFERENCE_WIDTH = 360
const REFERENCE_HEIGHT = 562
const SIGNATURE_HEIGHT = 100

const AddSignature = ({
  pdf,
  setPdf,
  setShowCroppedLayout,
}: {
  pdf: string
  setPdf: React.Dispatch<React.SetStateAction<string | null>>
  setShowCroppedLayout: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [fileDownloaded, setFileDownloaded] = useState<boolean>(false)
  const [getSignaturePad, setSignaturePad] = useState<boolean>(true)
  const [pdfEditMode, setPdfEditMode] = useState<boolean>(false)
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null)
  const [signatureArrayBuffer, setSignatureArrayBuffer] =
    useState<ArrayBufferLike | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBufferLike | null>(
    null,
  )
  const [newPdfSaved, setNewPdfSaved] = useState<boolean>(false)
  const [newPdfPath, setNewPdfPath] = useState<string | null>(null)
  const [filePath, setFilePath] = useState<string | null>(pdf)
  const [layoutWidth, setLayoutWidth] = useState(0)
  const [layoutHeight, setLayoutHeight] = useState(0)
  const [sizesAdj, setPageAdj] = useState({ pageAWidth: 0, pageAHeight: 0 })
  const [tap, setProcessTap] = useState(false)
  const [signatureSize, setSignatureSize] = useState(SIGNATURE_HEIGHT)
  const pdfRef = useRef(null)
  const [numberOfPages, setNumberOfPages] = useState<null | number>(null)
  const { Layout, Colors, Gutters } = useTheme()
  const isDarkMode = useSelector(selectDarkMode)
  const theme = useSelector(selectTheme)
  const [pdfBufferInfo, setPdfBufferInfo] = useState<null | PDFDocument>(null)
  const [page, currentPage] = useState(1)
  const [layoutRectangleInformation, setLayoutRectangleInformation] = useState({
    width: 0,
    height: 0,
    y: 0,
    x: 0,
  })

  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [defaultPositionCoords, setDefaultPositionCoords] = useState({
    x: layoutRectangleInformation.x,
    y: layoutRectangleInformation.y,
  })
  const [shouldRender, setShouldRender] = useState(true)

  const dimentions = Dimensions.get('window')
  const colorScheme = Appearance.getColorScheme()
  const isDark = isDarkMode === null

  const { x: defaultX, y: defaultY } = defaultPositionCoords

  const signatureWidth = signatureSize * 0.7

  useEffect(() => {
    setShouldRender(false)
    setTimeout(() => setShouldRender(true), 0)
  }, [defaultX, defaultY])

  useEffect(() => {
    if (tap) {
      handleSingleTap()
    }
  }, [tap])

  useEffect(() => {
    downloadFile()
    if (signatureBase64) {
      setSignatureArrayBuffer(_base64ToArrayBuffer(signatureBase64))
    }
    if (newPdfSaved) {
      setFilePath(newPdfPath!)
      setPdfArrayBuffer(_base64ToArrayBuffer(pdfBase64!))
    }
  }, [signatureBase64, filePath, newPdfSaved])

  useEffect(() => {
    if (pdfArrayBuffer) {
      PDFDocument.load(pdfArrayBuffer).then(pdfDoc => {
        setPdfBufferInfo(pdfDoc)
      })
    }
  }, [pdfArrayBuffer])

  const _base64ToArrayBuffer = (base64: string) => {
    const binary_string = atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout
    setLayoutWidth(width)
    setLayoutHeight(height)
  }

  const _uint8ToBase64 = (u8Arr: Uint8Array) => {
    const CHUNK_SIZE = 0x8000 //arbitrary number
    let index = 0
    const length = u8Arr.length
    let result = ''
    let slice
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length))
      result += String.fromCharCode.apply(null, slice)
      index += CHUNK_SIZE
    }
    return btoa(result)
  }

  const downloadFile = () => {
    if (!fileDownloaded) {
      RNFetchBlob.fs.readFile(pdf, 'base64').then(data => {
        setFileDownloaded(true)
        setPdfBase64(data)
        setPdfArrayBuffer(_base64ToArrayBuffer(data))
      })
    }
  }

  const handleSignature = (signature: string) => {
    setSignatureBase64(signature.replace('data:image/png;base64,', ''))
    setSignaturePad(false)
    setPdfEditMode(true)
  }

  const onPageChanged = (page: number) => {
    console.log('PAGE CHANGED')
    // if (isIOS) {
    //   setDefaultPositionCoords({
    //     x: defaultX + 0.0001,
    //     y: defaultY + 0.0001,
    //   })
    // }

    currentPage(page)
    if (pdfBufferInfo) {
      const { width, height } = pdfBufferInfo.getPage(page - 1).getSize()
      const ratio = layoutWidth / layoutHeight < width / height
      console.log('NUMBER_OF_PAGES', numberOfPages)
      const widthOffset =
        isIOS || (!isIOS && numberOfPages && numberOfPages <= 1)
          ? 0
          : (layoutWidth * 20) / REFERENCE_WIDTH
      const heightOffset =
        isIOS || (!isIOS && numberOfPages && numberOfPages <= 1)
          ? 0
          : (layoutHeight * 40) / REFERENCE_HEIGHT

      // const widthOffset = 0
      // const heightOffset = 0

      const pwr = ratio
        ? layoutWidth
        : (layoutHeight * width) / height - widthOffset
      const phr = ratio
        ? (layoutWidth * height) / width
        : layoutHeight - heightOffset
      setPageAdj({ pageAWidth: pwr, pageAHeight: phr })
    }
    setShouldRender(true)
  }

  const handleSingleTap = async () => {
    setProcessTap(false)
    if (pdfEditMode && pdfBufferInfo) {
      setFilePath(null)
      setPdfEditMode(false)
      setNewPdfSaved(false)
      const { width, height } = pdfBufferInfo.getPage(page - 1).getSize()
      console.log('PFDDOCwidth', width)
      console.log('PFDDOCheight', height)
      const { x, y } = coords
      console.log('X')

      const pages = pdfBufferInfo.getPages()
      const firstPage = pages[page - 1]

      // The meat
      const signatureImage = await pdfBufferInfo.embedPng(signatureArrayBuffer!)
      if (Platform.OS == 'ios') {
        const { pageAHeight, pageAWidth } = sizesAdj
        console.log('pppageBoundWidth', pageAWidth)
        console.log('pppageBoundHeight', pageAHeight)

        console.log('pppx', x)
        console.log('pppy', y)

        // const adjustX = x - (layoutWidth - pageAWidth) / 2
        // const adjustY = y - (layoutHeight - pageAHeight) / 2
        const adjustX = x <= 0 ? 0 : x - (layoutWidth - pageAWidth) / 2
        const adjustY = y <= 0 ? 0 : y - (layoutHeight - pageAHeight) / 2
        console.log('adjustX', adjustX)
        console.log('adjustY', adjustY)
        console.log('pppwidth', width)
        console.log('pppheight', height)

        const newX = (width * adjustX) / pageAWidth
        const newY =
          height -
          (height * adjustY + signatureSize) / pageAHeight -
          (height * signatureSize) / pageAHeight

        console.log('pppnewX', newX)
        console.log('pppnewY', newY)
        const object = {
          x: newX,
          y: newY,
          width: (width * signatureWidth) / pageAWidth,
          height: (height * signatureSize) / pageAHeight,
        }

        firstPage.drawImage(signatureImage, object)
      } else {
        const { pageAHeight, pageAWidth } = sizesAdj
        console.log('pppageBoundWidth', pageAWidth)
        console.log('pppageBoundHeight', pageAHeight)

        console.log('pppx', x)
        console.log('pppy', y)

        // const adjustX =
        //   x - (layoutWidth - pageAWidth) / 2 < 0
        //     ? x
        //     : x - (layoutWidth - pageAWidth) / 2
        // const adjustY =
        //   y - (layoutHeight - pageAHeight) / 2 < 0
        //     ? y
        //     : y - (layoutHeight - pageAHeight)
        const adjustX = x <= 0 ? 0 : x - (layoutWidth - pageAWidth) / 2
        const adjustY = y <= 0 ? 0 : y - (layoutHeight - pageAHeight) / 2
        console.log('adjustX', adjustX)
        console.log('adjustY', adjustY)
        console.log('pppwidth', width)
        console.log('pppheight', height)

        const newX = (width * adjustX) / pageAWidth
        const newY =
          height -
          (height * adjustY + signatureSize) / pageAHeight -
          (height * signatureSize) / pageAHeight

        console.log('pppnewX', newX)
        console.log('pppnewY', newY)
        const object = {
          x: newX,
          y: newY,
          width: (width * signatureWidth) / pageAWidth,
          height: (height * signatureSize) / pageAHeight,
        }

        firstPage.drawImage(signatureImage, object)
      }
      // Play with these values as every project has different requirements
      const pdfBytes = await pdfBufferInfo.save()
      const pdfBase64 = _uint8ToBase64(pdfBytes)
      const {
        dirs: { CacheDir },
      } = RNFetchBlob.fs

      const filePathD = `${CacheDir}/document_signed_${Date.now()}.pdf`
      RNFetchBlob.fs
        .writeFile(filePathD, pdfBase64, 'base64')
        .then(() => {
          setNewPdfPath(filePathD)
          setNewPdfSaved(true)
          setPdfBase64(pdfBase64)
          setPdf(filePathD)
          setShowCroppedLayout(7)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <View
      style={{
        ...Layout.justifyContentBetween,
        ...Layout.fill,
        backgroundColor: Colors.backgroundMainColor,
      }}
    >
      {getSignaturePad ? (
        <Signature
          onOK={sig => handleSignature(sig)}
          onEmpty={() => console.log('___onEmpty')}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
          webStyle={`.m-signature-pad { background-color: ${
            Colors.backgroundMainColor
          }; border: none; top: 0; left: 0; right: 0; bottom: 0; min-height: ${
            isIOS ? dimentions.height - 150 : dimentions.height - 100
          }px; margin: 0; } .m-signature-pad--footer { background-color: ${
            Colors.backgroundMainColor
          }} body {background: ${
            Colors.backgroundMainColor
          }} .m-signature-pad--body
          canvas {filter: invert(${
            isDarkMode ? 1 : 0
          })} .m-signature-pad--body {
            border: none;
          }`}
        />
      ) : (
        fileDownloaded && (
          <View style={[Layout.justifyContentBetween, Layout.fill]}>
            {!!filePath ? (
              <View
                onLayout={onLayout}
                style={[
                  Layout.justifyContentCenter,
                  Layout.fill,
                  Layout.relative,
                  // { borderColor: Colors.text, borderWidth: 2 },
                ]}
              >
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout
                    setDefaultPositionCoords({
                      x: layout.x,
                      y: layout.y,
                    })
                    setLayoutRectangleInformation({
                      height: layout.height,
                      width: layout.width,
                      x: layout.x,
                      y: layout.y,
                    })
                  }}
                  style={{
                    width: sizesAdj.pageAWidth,
                    height: sizesAdj.pageAHeight,
                    // borderColor: Colors.primary,
                    // borderWidth: 2,
                    position: 'absolute',
                    // zIndex: 10,
                    alignSelf: 'center',
                    // backgroundColor: Colors.pending,
                  }}
                />
                <Pdf
                  ref={pdfRef}
                  source={{ uri: `file://${filePath}` }}
                  minScale={1.0}
                  maxScale={1.0}
                  scale={1.0}
                  spacing={0}
                  fitPolicy={2}
                  horizontal={false}
                  enablePaging={true}
                  activityIndicatorProps={{ color: Colors.primary }}
                  onLoadComplete={numberOfPages => {
                    setNumberOfPages(numberOfPages)
                    if (numberOfPages >= 1) {
                      console.log(pdfRef.current)
                      onPageChanged(1)
                    }
                  }}
                  onError={() => {
                    // setPreviewError(true)
                  }}
                  onPageChanged={page => {
                    setShouldRender(false)
                    onPageChanged(page)
                  }}
                  style={{
                    // zIndex: 10,
                    flex: 1,
                    backgroundColor: Colors.backgroundMainColor,
                  }}
                />
                {shouldRender && (
                  <Draggable
                    x={defaultPositionCoords.x}
                    y={defaultPositionCoords.y}
                    z={1000}
                    onDragRelease={(event, gestureState, bounds) => {
                      console.log('bounds', bounds)
                      setCoords({ x: bounds.left, y: bounds.top })
                    }}
                    minX={layoutRectangleInformation.x}
                    minY={layoutRectangleInformation.y}
                    maxX={
                      layoutRectangleInformation.x +
                      layoutRectangleInformation.width
                    }
                    maxY={
                      layoutRectangleInformation.y +
                      layoutRectangleInformation.height
                    }
                  >
                    <Image
                      style={{
                        width: signatureWidth,
                        height: signatureSize,
                        resizeMode: 'contain',
                        borderColor: Colors.primary,
                        borderRadius: 1,
                        borderWidth: 2,
                      }}
                      source={{
                        uri: `data:image/png;base64,${signatureBase64}`,
                      }}
                    />
                  </Draggable>
                )}
              </View>
            ) : (
              <View
                style={[
                  Layout.fill,
                  { justifyContent: 'center' },
                  Layout.alignItemsCenter,
                  Layout.scale100HPadding,
                  Layout.scale100VPadding,
                  Layout.scale100VMargin,
                ]}
              >
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ color: Colors.primary }}>
                  Saving PDF File...
                </Text>
              </View>
            )}
            {pdfEditMode && filePath && (
              <View
                // onPress={() => setProcessTap(true)}
                style={{
                  ...Layout.row,
                  ...Layout.alignItemsCenter,
                  ...Layout.justifyContentCenter,
                  ...Gutters.scale140HPadding,
                  ...Gutters.scale140VPadding,
                  ...Gutters.scale100VMargin,
                  // backgroundColor: Colors.primary,
                  color: Colors.white,
                }}
              >
                <FilterSlider
                  value={signatureSize}
                  setValue={setSignatureSize}
                  min={50}
                  max={200}
                  step={1}
                  sliderLength={layoutWidth * 0.6}
                />
                {/* </View> */}

                <BaseButton
                  style={{ display: 'flex', flex: 1, marginLeft: 20 }}
                  textStyle={{
                    display: 'flex',
                    flexShrink: 1,
                    flexWrap: 'wrap',
                    textAlign: 'center',
                  }}
                  disabled={tap}
                  loading={tap}
                  onPress={
                    isIOS
                      ? () => {
                          setFilePath(null)
                          setProcessTap(true)
                        }
                      : () => handleSingleTap()
                  }
                  label={'Place signature'}
                />
              </View>
            )}
          </View>
        )
      )}
    </View>
  )
}

export default AddSignature
