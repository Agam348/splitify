import { useMemo } from 'react'
import { Scissors, Loader2, Monitor } from 'lucide-react'

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <AppHeader />

      {!isDesktop && (
        <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 px-6 py-2.5 text-center text-xs font-medium text-amber-900 shadow-2xs">
          <div className="flex items-center justify-center gap-2">
            <Monitor className="size-4 text-amber-700 shrink-0" />
            <span>
              <strong>Web Preview Mode:</strong> Native video stream cutting and OS file access are active inside the <strong>Splitify Desktop App</strong>.
            </span>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Split Master Video
          </h1>
        </div>

        <div className="space-y-6">
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

          <Card className="border-slate-200/80 shadow-card">
            <CardContent className="space-y-7 p-6 sm:p-8">
              <ProjectDetails
                error={validation.fieldErrors.projectName}
                projectName={configuration.projectName}
                onProjectNameChange={configuration.setProjectName}
              />

              <div className="border-t border-slate-100" />

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

              <div className="border-t border-slate-100" />

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
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {validation.fieldWarnings.outputFilename} Unique filenames will be automatically allocated.
                </div>
              )}

              <Button
                type="button"
                size="lg"
                className="w-full gap-2.5 h-12 text-base font-bold shadow-md shadow-emerald-600/20"
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
                {splitting.isProcessing ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Splitting Video...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="size-5" />
                    <span>Split Video</span>
                  </>
                )}
              </Button>

              <ProcessingResult result={splitting.result} />

              {validation.error && (
                <p className="text-center text-xs font-medium text-red-600">
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
