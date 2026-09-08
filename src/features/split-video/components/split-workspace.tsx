import { useMemo } from 'react'
import { Scissors } from 'lucide-react'

import { AppHeader } from '../../../components/layout/app-header'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
} from '../../../components/ui/card'
import { useVideoPicker } from '../hooks/use-video-picker'
import { useOutputFolder } from '../hooks/use-output-folder'
import { useSplitConfiguration } from '../hooks/use-split-configuration'
import { useSplitValidation } from '../hooks/use-split-validation'
import { useVideoSplitting } from '../hooks/use-video-splitting'
import { OutputFolder } from './output-folder'
import { ProgressSection } from './progress-section'
import { ProjectDetails } from './project-details'
import { SplitMethod } from './split-method'
import { VideoDropzone } from './video-dropzone'
import { VideoInformation } from './video-information'
import { ProcessingResult } from './processing-result'

export function SplitWorkspace() {
  const outputFolder = useOutputFolder()
  const configuration = useSplitConfiguration()
  const splitting = useVideoSplitting()
  const {
    isReadingMetadata,
    isSelectingVideo,
    metadata,
    metadataError,
    selectedVideoPath,
    selectVideo,
  } = useVideoPicker()
  const validationInput = useMemo(() => ({
    videoPath: selectedVideoPath,
    videoDurationSeconds: metadata?.durationSeconds ?? null,
    projectName: configuration.projectName,
    splitMethod: configuration.splitMethod,
    splitDurationSeconds: configuration.splitDurationSeconds,
    equalParts: configuration.equalParts,
    outputFolder: outputFolder.outputFolder,
  }), [
    configuration.equalParts,
    configuration.projectName,
    configuration.splitDurationSeconds,
    configuration.splitMethod,
    metadata?.durationSeconds,
    outputFolder.outputFolder,
    selectedVideoPath,
  ])
  const validation = useSplitValidation(validationInput)
  const isDesktop = typeof window !== 'undefined' && Boolean(window.splitify)

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      {!isDesktop && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-center text-xs font-medium text-amber-800">
          💻 <strong>Browser Preview Mode:</strong> You are viewing Splitify in a standard web browser. Real-time lossless video splitting and native file access run inside the <strong>Splitify Desktop Application</strong> window.
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-7">
          <p className="text-sm font-semibold text-primary">
            New split project
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Prepare your video clips
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose a video and configure how you want it divided.
          </p>
        </div>

        <div className="space-y-5">
          <VideoDropzone
            error={validation.fieldErrors.video}
            isReadingMetadata={isReadingMetadata}
            isSelectingVideo={isSelectingVideo}
            selectedVideoPath={selectedVideoPath}
            onBrowseVideo={selectVideo}
          />
          <VideoInformation
            isLoading={isReadingMetadata}
            metadata={metadata}
            error={metadataError}
          />

          <Card className="shadow-soft">
            <CardContent className="space-y-7 p-6">
              <ProjectDetails
                error={validation.fieldErrors.projectName}
                projectName={configuration.projectName}
                onProjectNameChange={configuration.setProjectName}
              />

              <div className="h-px bg-slate-100" />

              <SplitMethod
                durationError={validation.fieldErrors.splitDuration}
                durationInput={configuration.durationInput}
                equalPartsError={validation.fieldErrors.equalParts}
                equalPartsInput={configuration.equalPartsInput}
                isCustomDuration={configuration.isCustomDuration}
                splitMethod={configuration.splitMethod}
                onDurationChange={configuration.setDurationInput}
                onDurationPresetChange={configuration.selectDurationPreset}
                onEqualPartsChange={configuration.setEqualPartsInput}
                onSplitMethodChange={configuration.setSplitMethod}
              />

              <div className="h-px bg-slate-100" />

              <OutputFolder
                error={
                  outputFolder.error ??
                  validation.fieldErrors.outputFolder ??
                  null
                }
                isLoading={outputFolder.isLoading}
                isSelecting={outputFolder.isSelecting}
                outputFolder={outputFolder.outputFolder}
                onChoose={outputFolder.selectOutputFolder}
              />

              {validation.fieldWarnings.outputFilename && (
                <p className="text-sm text-amber-700">
                  {validation.fieldWarnings.outputFilename} Unique names will be used.
                </p>
              )}

              <Button
                type="button"
                size="lg"
                className="w-full gap-2"
                disabled={
                  validation.isValidating ||
                  !validation.isValid ||
                  isReadingMetadata ||
                  splitting.isProcessing
                }
                onClick={() => {
                  if (
                    selectedVideoPath &&
                    outputFolder.outputFolder
                  ) {
                    if (
                      configuration.splitMethod === 'duration' &&
                      configuration.splitDurationSeconds !== null
                    ) {
                      void splitting.splitByDuration({
                        inputPath: selectedVideoPath,
                        outputFolder: outputFolder.outputFolder,
                        projectName: configuration.projectName,
                        splitMethod: 'duration',
                        clipDurationSeconds: configuration.splitDurationSeconds,
                      })
                    } else if (
                      configuration.splitMethod === 'equal-parts' &&
                      configuration.equalParts !== null
                    ) {
                      void splitting.splitByDuration({
                        inputPath: selectedVideoPath,
                        outputFolder: outputFolder.outputFolder,
                        projectName: configuration.projectName,
                        splitMethod: 'equal-parts',
                        equalParts: configuration.equalParts,
                      })
                    }
                  }
                }}
              >
                <Scissors className="size-4" />
                {splitting.isProcessing ? 'Splitting Video...' : 'Split Video'}
              </Button>

              <ProcessingResult result={splitting.result} />

              {validation.error && (
                <p className="text-center text-xs text-red-600">
                  {validation.error}
                </p>
              )}
            </CardContent>
          </Card>

          <ProgressSection
            isProcessing={splitting.isProcessing}
            progress={splitting.progress}
            onCancel={splitting.cancel}
          />
        </div>
      </main>
    </div>
  )
}
